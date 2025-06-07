<script lang="ts">
	interface Props {
		/**
		 * Number of columns for different breakpoints
		 * Default: { sm: 1, md: 2, lg: 3, xl: 4 }
		 */
		cols?: {
			sm?: number;
			md?: number;
			lg?: number;
			xl?: number;
			'2xl'?: number;
		};
		/**
		 * Gap between grid items
		 * Default: 'md' (1rem)
		 */
		gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content
		 */
		children?: any;
	}

	let {
		cols = { sm: 1, md: 2, lg: 3, xl: 4 },
		gap = 'md',
		class: className = '',
		children
	}: Props = $props();

	// Generate responsive grid classes
	const gridClasses = $derived.by(() => {
		const classes = ['grid'];
		
		// Add responsive column classes using explicit mappings
		if (cols.sm) classes.push(`grid-cols-${cols.sm}`);
		if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
		if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
		if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
		if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
		
		// Add gap class
		const gapMap = {
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-4',
			lg: 'gap-6',
			xl: 'gap-8',
			'2xl': 'gap-12'
		};
		classes.push(gapMap[gap]);
		
		// Add custom classes
		if (className) classes.push(className);
		
		const finalClasses = classes.join(' ');
		
		return finalClasses;
	});

	// Ensure grid handles mobile touch scrolling
	const gridClasses_enhanced = $derived(gridClasses + ' mobile-scroll');
</script>

<div class={gridClasses_enhanced}>
	{@render children()}
</div> 