/**
 * SPDX-FileCopyrightText: 2026 锐冰(SharpIce)
 * SPDX-License-Identifier: 0BSD
 */

import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import websiteNuxtConfig from '@anc/website/.nuxt/eslint.config.mjs';

const config = antfu(
	{
		markdown: false,
		stylistic: false,
		typescript: {
			tsconfigPath: 'tsconfig.json',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	websiteNuxtConfig(),
	{
		rules: {
			eqeqeq: 'error',
			'pnpm/json-enforce-catalog': 'off',
			'pnpm/yaml-enforce-settings': 'off',

			/* 排序 */
			'yaml/sort-keys': 'off',
			'vue/block-order': 'off',
			'jsonc/sort-keys': 'off',
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-named-exports': 'off',
			'perfectionist/sort-named-imports': 'off',

			// 采用 TypeScript 的校验替代
			'vue/dot-notation': 'off',
		},
	},
).append(eslintConfigPrettier);

export default config;
