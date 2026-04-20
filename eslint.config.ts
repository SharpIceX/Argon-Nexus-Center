/**
 * SPDX-FileCopyrightText: 2026 锐冰(SharpIce)
 * SPDX-License-Identifier: 0BSD
 */

import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import websiteNuxtConfig from '@anc/website/.nuxt/eslint.config.mjs';

const config = antfu(
	{
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

			/** pnpm 安全性 */
			'pnpm/yaml-enforce-settings': 'off',

			/** 排序 */
			'yaml/sort-keys': 'off',
			'jsonc/sort-keys': 'off',
			'perfectionist/sort-imports': 'off',
		},
	},
).append(eslintConfigPrettier);

export default config;
