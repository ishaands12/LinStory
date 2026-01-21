import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Equation Component
 * Renders LaTeX using KaTeX with support for dynamic variable substitution.
 * 
 * @param {string} tex - The LaTeX string. Use {{varName}} for dynamic variables.
 * @param {boolean} block - If true, renders in display mode (centered, new line).
 * @param {object} variables - Key-value pairs matching the {{placeholders}}.
 * @param {object} highlights - Key map to color strings for highlighting specific parts.
 */
export default function Equation({ tex, block = false, variables = {}, highlights = {} }) {

    // Process the TeX string: Substitute {{key}} with values or highlighted versions
    const processedTex = useMemo(() => {
        let result = tex;

        // 1. Substitute Variables
        Object.entries(variables).forEach(([key, val]) => {
            // If the value is a number, we might formatted it. For now, simple string replacement.
            // We use a regex to replace {{key}} globally.
            const regex = new RegExp(`{{${key}}}`, 'g');

            // Check if this variable should also be highlighted
            if (highlights[key]) {
                result = result.replace(regex, `{\\color{${highlights[key]}} ${val}}`);
            } else {
                result = result.replace(regex, val);
            }
        });

        return result;
    }, [tex, variables, highlights]);

    const html = useMemo(() => {
        try {
            return katex.renderToString(processedTex, {
                displayMode: block,
                throwOnError: false, // Render error message instead of crashing
                output: 'html',      // Use HTML output for accessibility
            });
        } catch (error) {
            console.error("KaTeX Error:", error);
            return `<span style="color:red">Error rendering equation</span>`;
        }
    }, [processedTex, block]);

    return (
        <span
            className={block ? "math-block" : "math-inline"}
            dangerouslySetInnerHTML={{ __html: html }}
            style={{
                display: block ? 'block' : 'inline-block',
                margin: block ? '1rem 0' : '0 0.2rem',
                fontSize: '1.1em'
            }}
        />
    );
}
