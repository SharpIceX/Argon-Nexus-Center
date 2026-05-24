import type { CustomAtRules, Visitor } from 'lightningcss';

export default {
	Rule(rule) {
		if (rule.type !== 'font-face') {
			return;
		}

		let hasValidSource = false;

		const newProperties = rule.value.properties.map((propertiesItem) => {
			if (propertiesItem.type !== 'source') {
				return propertiesItem;
			}

			const filteredSources = propertiesItem.value.filter((sourceItem) => {
				if (sourceItem.type === 'url' && sourceItem.value.format?.type === 'woff') {
					return false;
				}
				return true;
			});

			// 删除 woff 后，src为空，则标记删除整个 @font-face
			if (filteredSources.length > 0) {
				hasValidSource = true;
			}

			return {
				...propertiesItem,
				value: filteredSources,
			};
		});

		// src 为空，则删除整个 @font-face
		if (!hasValidSource) {
			return [];
		}

		return {
			type: 'font-face',
			value: {
				...rule.value,
				properties: newProperties,
			},
		};
	},
} satisfies Visitor<CustomAtRules>;
