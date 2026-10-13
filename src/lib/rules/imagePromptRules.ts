/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptIssue, PromptContext } from './types.ts';

export function detectImagePromptRules(text: string, context: PromptContext): PromptIssue[] {
  if (context.goal !== 'image_generation' && context.targetTool !== 'midjourney') {
    return [];
  }

  const issues: PromptIssue[] = [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // 1. Check Style (photorealistic, oil painting, watercolor, 3d render, anime, minimal vector)
  const hasStyle = /\b(style|photorealistic|3d render|octane render|unreal engine|digital art|oil painting|watercolor|anime|cinematic|isometric|cyberpunk|line art|vector|hyperrealistic|studio photo)\b/i.test(trimmed);
  if (!hasStyle) {
    issues.push({
      id: 'img-style',
      category: 'image_style',
      severity: 'important',
      range: [0, Math.min(trimmed.length, 12)],
      highlightText: text.substring(0, Math.min(trimmed.length, 12)),
      message: 'Missing visual art style',
      explanation: 'Specify the aesthetic style (e.g. Cinematic 35mm photograph, octane render, watercolor illustration) to avoid generic default renders.',
      suggestions: [
        { text: `${trimmed}, cinematic 35mm film photography, award-winning shot`, label: 'Cinematic 35mm Film' },
        { text: `${trimmed}, hyperrealistic 3D octane render, 8k resolution`, label: '3D Octane Render' },
        { text: `${trimmed}, minimal vector illustration, flat design palette`, label: 'Minimal Vector Illustration' }
      ]
    });
  }

  // 2. Check Lighting (golden hour, volumetric, dramatic chiaroscuro, studio lighting, neon)
  const hasLighting = /\b(lighting|light|golden hour|volumetric light|chiaroscuro|backlit|rim light|studio lighting|soft shadows|neon glow|dramatic shadow|sunlight)\b/i.test(trimmed);
  if (!hasLighting) {
    issues.push({
      id: 'img-lighting',
      category: 'image_lighting',
      severity: 'important',
      range: [Math.max(0, trimmed.length - 10), trimmed.length],
      highlightText: text.substring(Math.max(0, trimmed.length - 10), trimmed.length),
      message: 'Missing lighting specification',
      explanation: 'Lighting creates realism and mood. Add lighting cues like golden hour, volumetric rays, or soft studio rim lighting.',
      suggestions: [
        { text: `${trimmed}, warm golden hour lighting with soft diffused shadows`, label: 'Golden Hour Sunlight' },
        { text: `${trimmed}, dramatic chiaroscuro lighting, moody high contrast`, label: 'Dramatic High-Contrast' },
        { text: `${trimmed}, professional soft studio lighting, balanced exposure`, label: 'Soft Studio Lighting' }
      ]
    });
  }

  // 3. Check Composition / Camera angle (wide shot, close-up, rule of thirds, bird's eye view, bokeh)
  const hasComposition = /\b(wide angle|wide shot|close-up|macro|extreme close up|birds-eye|low angle|high angle|bokeh|depth of field|rule of thirds|centered composition|composition|drone shot)\b/i.test(trimmed);
  if (!hasComposition) {
    issues.push({
      id: 'img-composition',
      category: 'image_composition',
      severity: 'style',
      range: [Math.max(0, trimmed.length - 8), trimmed.length],
      highlightText: text.substring(Math.max(0, trimmed.length - 8), trimmed.length),
      message: 'Missing camera shot & composition',
      explanation: 'Define camera framing (close-up portrait, expansive wide angle, shallow depth of field) to dictate the viewer’s perspective.',
      suggestions: [
        { text: `${trimmed}, shallow depth of field with creamy bokeh background`, label: 'Shallow Depth of Field' },
        { text: `${trimmed}, wide angle perspective, rule-of-thirds composition`, label: 'Wide Angle Rule-of-Thirds' },
        { text: `${trimmed}, detailed macro close-up focus`, label: 'Detailed Macro Close-Up' }
      ]
    });
  }

  // 4. Check Aspect Ratio (--ar 16:9, --ar 1:1, --ar 9:16, 16:9 aspect ratio)
  const hasAspectRatio = /(?:--ar\s+\d+:\d+|\b\d+:\d+\s+aspect\s+ratio\b|\baspect\s+ratio\s+\d+:\d+\b)/i.test(trimmed);
  if (!hasAspectRatio) {
    issues.push({
      id: 'img-aspect-ratio',
      category: 'image_aspect_ratio',
      severity: 'important',
      range: [Math.max(0, trimmed.length - 4), trimmed.length],
      highlightText: text.substring(Math.max(0, trimmed.length - 4), trimmed.length),
      message: 'Missing aspect ratio parameter',
      explanation: 'AI image generators default to a 1:1 square. Specify your intended aspect ratio (--ar 16:9 for landscape, --ar 9:16 for mobile/stories).',
      suggestions: [
        { text: `${trimmed} --ar 16:9`, label: 'Landscape (--ar 16:9)' },
        { text: `${trimmed} --ar 9:16`, label: 'Portrait / Mobile (--ar 9:16)' },
        { text: `${trimmed} --ar 4:5`, label: 'Instagram Feed (--ar 4:5)' }
      ]
    });
  }

  return issues;
}
