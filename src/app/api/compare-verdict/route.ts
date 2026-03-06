import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchImageAsDataUrl } from '../assess-condition/image';
import { isOpenAIErrorWithCode } from '../assess-condition/normalize';
import { buildCompareVerdictPrompt } from './prompt';
import { parseVerdictResponse } from './normalize';
import type { CompareVerdictRequest } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompareVerdictRequest;

    // Validate at least one description or image is present
    const hasContent =
      body.leftDescription || body.rightDescription || body.leftImageUrl || body.rightImageUrl;

    if (!hasContent) {
      return NextResponse.json(
        { success: false, error: 'At least one description or image URL is required' },
        { status: 400 },
      );
    }

    // Fetch images (max 1 per listing, skip video URLs)
    const [leftImageDataUrl, rightImageDataUrl] = await Promise.all([
      body.leftImageUrl ? fetchImageAsDataUrl(body.leftImageUrl) : Promise.resolve(null),
      body.rightImageUrl ? fetchImageAsDataUrl(body.rightImageUrl) : Promise.resolve(null),
    ]);

    // Build prompt
    const promptText = buildCompareVerdictPrompt(body);

    // Build content array: text + up to 2 images
    const contentParts: Array<
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string; detail: 'low' } }
    > = [{ type: 'text', text: promptText }];

    if (leftImageDataUrl) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: leftImageDataUrl, detail: 'low' },
      });
    }

    if (rightImageDataUrl) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: rightImageDataUrl, detail: 'low' },
      });
    }

    // Call OpenAI with retry on invalid_image_url
    const response = await (async () => {
      try {
        return await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: contentParts }],
          response_format: { type: 'json_object' },
          max_tokens: 800,
        });
      } catch (caughtError) {
        if (isOpenAIErrorWithCode(caughtError, 'invalid_image_url')) {
          console.error(
            'Compare verdict OpenAI request failed with invalid_image_url, retrying text-only',
            { error: caughtError },
          );

          return await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: [{ type: 'text', text: promptText }] }],
            response_format: { type: 'json_object' },
            max_tokens: 800,
          });
        }

        throw caughtError;
      }
    })();

    const content = response.choices[0]?.message?.content;

    if (!content) {
      console.error('Compare verdict OpenAI response missing message content');
      return NextResponse.json(
        { success: false, error: 'No response from OpenAI' },
        { status: 500 },
      );
    }

    const verdict = parseVerdictResponse(content);

    return NextResponse.json({ success: true, verdict });
  } catch (caughtError) {
    console.error('Compare verdict error:', caughtError);

    return NextResponse.json(
      {
        success: false,
        error: caughtError instanceof Error ? caughtError.message : 'Failed to generate verdict',
      },
      { status: 500 },
    );
  }
}
