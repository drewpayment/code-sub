<script lang="ts">
	interface Props {
		/**
		 * Container size variants
		 * - sm: max-w-screen-sm (640px)
		 * - md: max-w-screen-md (768px)
		 * - lg: max-w-screen-lg (1024px)
		 * - xl: max-w-screen-xl (1280px)
		 * - 2xl: max-w-screen-2xl (1536px)
		 * - full: max-w-full
		 * - none: no max-width constraint
		 */
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
		/**
		 * Horizontal padding
		 */
		padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
	size = 'xl',
	padding = 'md',
	class: className = '',
	children
}: Props = $props();

const containerClasses = $derived(() => {
	const classes = ['w-full', 'mx-auto'];
	
	// Add max-width based on size
	const sizeMap = {
		sm: 'max-w-screen-sm',
		md: 'max-w-screen-md',
		lg: 'max-w-screen-lg',
		xl: 'max-w-screen-xl',
		'2xl': 'max-w-screen-2xl',
		full: 'max-w-full',
		none: ''
	};
	
	if (sizeMap[size]) {
		classes.push(sizeMap[size]);
	}
	
	// Add padding
	const paddingMap = {
		xs: 'px-2',
		sm: 'px-4',
		md: 'px-4 sm:px-6',
		lg: 'px-6 lg:px-8',
		xl: 'px-8 lg:px-12'
	};
	classes.push(paddingMap[padding]);
	
	// Add custom classes
	if (className) classes.push(className);
	
	return classes.join(' ');
});
</script>

<div class={containerClasses}>
	{@render children()}
</div> 