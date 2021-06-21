import Roact from '@rbxts/roact';

// Hook Functions
declare namespace RoactHooks {
	/**
	 *  A Function Component
	 */
	export type FC<P = {}> = (props: P, hooks: HookFunctions) => Roact.Element | undefined;
	/**
	 *  Library's hook functions
	 */
	export interface HookFunctions {
		/** Used to store a stateful value. Returns the current value, and a function that can be used to set the value. */
		useState<T>(defaultValue: T): LuaTuple<[T, (newValue: T) => void]>;
		/**
		 *  Used to perform a side-effect with a callback function.
		 *
		 *  This callback function can return a destructor. When the component unmounts, this function will be called.
		 *
		 *  You can also pass in a list of dependencies to `useEffect`. If passed, then only when those dependencies change will the callback function be re-ran.
		 */
		useEffect(callback: (() => () => void) | undefined, dependencies?: any[]): void;
		/** Returns the value of the [context](https://roblox.github.io/roact/advanced/context/). */
		useContext<T>(context: RoactContext<T>): T;
		/** 
		 *  Similar to [useRef in React](https://reactjs.org/docs/hooks-reference.html#useref).
		    Creates a table that you can mutate without re-rendering the component every time.
		    Think of it like a class variable (`self.something = 1` vs. `self:setState({ something = 1 })`).
		 */
		useValue<T>(value: T): { value: T };
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) callback.
		 *
		 *  `useCallback(callback, dependencies)` is equivalent to `useMemo(function() return callback end, dependencies)`.
		 */
		useCallback<F extends (...args: any[]) => any>(callback: F, dependencies?: any[]): F;
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.
		 *
		 *  `useMemo` will only recalculate the inner value when the dependencies have changed.
		 *
		 *  The function passed to `useMemo` runs during rendering, so don't perform any side effects.
		 */
		useMemo<T>(createValue: () => T, dependencies?: any[]): T;
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) [binding](https://roblox.github.io/roact/advanced/bindings-and-refs/#bindings).
		 *
		 *  These can then be used just like normal bindings in Roact.
		 */
		useBinding<T>(defaultValue: T): LuaTuple<[Roact.BindingFunction<T>, (newValue: T) => void]>;
		/**
		 * An alternative to `useState` that uses a reducer rather than state directly.
		   If you’re familiar with Rodux, you already know how this works.
		 */
		useReducer<S = {}, A extends Action = AnyAction>(
			reducer: (state: S, action: A) => void,
			initialState: S
		): LuaTuple<[S, (action: A) => void]>;
	}
}

// Utility Types
declare namespace RoactHooks {
	/**
	 *  Extracts the props type from a Function Component.
	 */
	export type InferFCProps<T> = T extends RoactHooks.FC<infer P> ? P : never;
	/**
	 *  Return type from [Roact.createContext](https://roblox.github.io/roact/api-reference/#roactcreatecontext).
	 */
	export type RoactContext<T> = {
		Provider: Roact.ComponentConstructor<{
			value: T;
		}>;
		Consumer: Roact.ComponentConstructor<
			{
				render: (value: T) => Roact.Element | undefined;
			},
			{}
		>;
	};
	/**
	 *  An action type for reducers
	 */
	export interface Action<T = string> {
		type: T;
	}
	/**
	 *  Any action
	 */
	export interface AnyAction extends Action {
		[extraProps: string]: unknown;
	}
}

/**
 *  It is required you pass in the Roact you are using, since you can't combine multiple versions of Roact together.
 * 
 *  Returns a function that can be used to create a new Roact component with hooks.
 *  An optional dictionary can be passed in. The following are the valid keys that can be used, and what they do.
 *
 *  @param name
 *  Refers to the name used in debugging. If it is not passed, it'll use the function name of what was passed in.
 *  For instance, `Hooks.new(Roact)(Component)` will have the component name `"Component"`.
 *
 *  @param defaultProps
 *  Defines default values for props to ensure props will have values even if they were not specified by the parent component.
 */
declare interface RoactHooks {
	new <P = {}>(roact: typeof Roact): (
		render: RoactHooks.FC<P>,
		options?: { name?: string, defaultProps: Partial<P> }
	) => (props: P) => Roact.Element;
}

declare const RoactHooks: RoactHooks;

export = RoactHooks;