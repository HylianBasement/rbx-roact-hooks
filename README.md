<div align="center"><img src="https://i.imgur.com/HkrF8kt.png"/></div>
<h1 align="center">Roact-Hooks-TS</h1>
<div align="center">
	A typescript port of the <a href="https://github.com/Kampfkarren/roact-hooks">Roact-Hooks</a> module.
</div>

## Installation
The installation can be done via `npm i @rbxts/roact-hooks`.

## Creating a hook
TODO

Example:
```ts
import Roact from '@rbxts/roact';
import Hooks from '@rbxts/roact-hooks';

interface Props {
	title: string;
}

const ClickCounter: Hooks.FC<Props> = (props, { useState }) => {
	const [counter, setCounter] = useState(0);

	return (
		<textbutton
			Text={`${props.title}: ${tostring(counter)}`}
			TextSize={18}
			Position={new UDim2(0.5, -100, 0.5, -25)}
			Size={UDim2.fromOffset(200, 50)}
			Event={{ MouseButton1Click: () => setCounter(counter + 1) }}
		/>
	);
};

export = new Hooks<Props>(Roact)(ClickCounter);
```

## License
The original Roact-Hooks library's License can be found [here](https://github.com/Kampfkarren/roact-hooks/blob/main/LICENSE.md).