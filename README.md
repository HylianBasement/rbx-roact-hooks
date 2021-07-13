<div align="center"><img src="https://i.imgur.com/HkrF8kt.png"/></div>
<h1 align="center">Roact-Hooks-TS</h1>
<div align="center">
	<a href="https://github.com/roblox-ts/roblox-ts">
		<img src="https://img.shields.io/badge/github-roblox_typescript-red.svg" alt="roblox-ts"></img>
	</a>
	<a href="https://www.npmjs.com/package/@rbxts/roact-hooks">
		<img src="https://badge.fury.io/js/%40rbxts%2Froact-hooks.svg"></img>
	</a>
</div>

<div align="center">
	A typescript port of the <a href="https://github.com/Kampfkarren/roact-hooks">Roact-Hooks</a> module. 
	An implementation of <a href="https://reactjs.org/docs/hooks-intro.html">React hooks</a> for Roact.
</div>

## Installation
The installation can be done via `npm i @rbxts/roact-hooks`.

## Intro to hooks
For the constructor, you should pass in the Roact you are using, since can't combine multiple versions of Roact together.

Returns a function that can be used to create a new Roact component with hooks. An optional object can be passed in. The following are the valid keys that can be used, and what they do.

#### name
Refers to the name used in debugging. If it is not passed, it'll use the function name of what was passed in.

#### defaultProps
Defines default values for props to ensure props will have values even if they were not specified by the parent component.

### Example
`ClickCounter.tsx`
```tsx
import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";

const ClickCounter: Hooks.FC = (_props, { useState }) => {
	const [counter, setCounter] = useState(0);

	return (
		<textbutton
			Text={tostring(counter)}
			TextSize={18}
			Position={new UDim2(0.5, -100, 0.5, -25)}
			Size={UDim2.fromOffset(200, 50)}
			Event={{ MouseButton1Click: () => setCounter(counter + 1) }}
		/>
	);
};

export = new Hooks(Roact)(ClickCounter);
```

### Props & Default Props Example
`PrintsOnClick.tsx`
```tsx
interface Props {
	buttonText: string;
	printMessage: string;
}

const PrintsOnClick: Hooks.FC<Props> = (props, { useCallback }) => {
	const doPrint = useCallback(() => {
		print(props.printMessage);
	});

	return (
		<textbutton
			Size={UDim2.fromScale(0.5, 0.5)}
			Text={props.buttonText}
			Event={{ Activated: () => doPrint() }}
		/>
	);
};

export = new Hooks(Roact)(PrintsOnClick, {
	defaultProps: {
		buttonText: "Click me...",
		printMessage: "it was clicked!"
	}
});
```

### Reducer Example
An alternative to `useState` that uses a reducer rather than state directly. If you’re familiar with Rodux, you already know how this works.

`Stepper.tsx`
```tsx
interface State {
	count: number;
}

const enum Actions {
        INCREMENT = "increment",
        DECREMENT = "decrement",
}

const initialState: State = {
        count: 0,
};

const reducer: Hooks.Reducer<State, Hooks.Action<Actions>> = (state, action) => {
        switch(action.type) {
                case Actions.INCREMENT:
                        return {
                                count: state.count + 1,
                        };
                case Actions.DECREMENT:
                        return {
                                count: state.count - 1,
                        };
        }
};

const Stepper: Hooks.FC = (_props, { useReducer }) => {
        const [state, dispatch] = useReducer(reducer, initialState);

        return (
                <frame
                        BackgroundTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                >
                        <uilistlayout
                                Key="UIListLayout"
                                FillDirection={Enum.FillDirection.Vertical}
                                Padding={new UDim(0, 5)}
                                SortOrder={Enum.SortOrder.LayoutOrder}
                        />
                        <textlabel
                                Key="Counters"
                                BackgroundTransparency={1}
                                Font={Enum.Font.Code}
                                LayoutOrder = {1}
                                Size={new UDim2(1, 0, 0, 38)}
                                Text={tostring(state.count)}
                                TextColor3={new Color3(0, 1, 0)}
                                TextSize={32}
                        />
                        <textbutton
                                Key="Increment"
                                BackgroundColor3={new Color3(0, 1, 0)}
                                Font={Enum.Font.Code}
                                LayoutOrder={2}
                                Size={new UDim2(1, 0, 0, 38)}
                                Text="Increment"
                                TextColor3={new Color3(1, 1, 1)}
                                TextScaled
                                Event={{
                                        Activated: () => {
                                                dispatch({
                                                        type: Actions.INCREMENT,
                                                })
                                        }
                                }}
                        />
                        <textbutton
                                Key="Decrement"
                                BackgroundColor3={new Color3(1, 0, 0)}
                                Font={Enum.Font.Code}
                                LayoutOrder={3}
                                Size={new UDim2(1, 0, 0, 38)}
                                Text="Decrement"
                                TextColor3={new Color3(1, 1, 1)}
                                TextScaled
                                Event={{
                                        Activated: () => {
                                                dispatch({
                                                        type: Actions.DECREMENT,
                                                })
                                        }
                                }}
                        />
                </frame>
        );
};

export = new Hooks(Roact)(Stepper);
```

## Creating a hook
To create a custom hook all you need to do is to create a function, with its name starting with `use`.
It may as well call other hooks.

### Example
`hooks.ts`
```ts
import ChatAPI, { Status } from "Server/ChatAPI";

export const useFriendStatus = (
        friendID: number,
        { useState, useEffect }: CoreHooks
) => {
        const [isOnline, setIsOnline] = useState(false);

        useEffect(() => {
                const handleStatusChange = (status: Status) => {
                        setIsOnline(status.isOnline);
                }

                ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
                return () => {
                        ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
                };
        });

        return isOnline;
};
```

`FriendListItem.tsx`
```tsx
import { useFriendStatus } from "./hooks.ts";

export interface FriendListItemProps {
        name: string;
        id: number;
}

const FriendListItem: Hooks.FC<FriendListItemProps> = (props, hooks) => {
        const isOnline = useFriendStatus(props.id, hooks);

        return (
                <frame
                        Key={props.name}
                        Size={UDim2.fromOffset(320, 70)}
                >
                        <textlabel
                                Key="Username"
                                BackgroundTransparency={1}
                                Size={new UDim2(1, -10, 1, 0)}
                                Text={props.name}
                                TextSize={14}
                        />
                        <frame
                                Key="Status"
                                BackgroundColor3={
                                        isOnline 
                                                ? Color3.fromRGB(0, 191, 3)
                                                : Color3.fromRGB(100, 100, 100)
                                }
                                BorderSizePixel={0}
                                Position={new UDim2(1, -10, 0, 0)}
                                Size={new UDim2(0, 10, 1, 0)}
                        />
                </frame>
        );
}

export default new Hooks(Roact)(FriendListItem)
```

To get more in depth on how this works, check the [original library's repository](https://github.com/Kampfkarren/roact-hooks#readme).

## License
This library is licensed under the [MPL-2.0 License](LICENSE.md). The original Roact-Hooks library's License can be found [here](https://github.com/Kampfkarren/roact-hooks/blob/main/LICENSE.md).