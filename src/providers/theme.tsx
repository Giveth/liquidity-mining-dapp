import { createContext, FC, ReactNode, useState } from 'react'

export enum ThemeType {
	Light,
	Dark,
}

const ligthTheme = {
	type: ThemeType.Light,
	bg: '#ffffff',
	fg: '#0D3382',
}

const darkTheme = {
	type: ThemeType.Dark,
	bg: '#ffffff',
	fg: '#0D3382',
}

export const ThemeContext = createContext({
	theme: ligthTheme,
	setTheme: function (theme: ThemeType) {
		console.log('ThemeContextSetState Not Impemented ')
	},
})

type Props = {
	children?: ReactNode
}

export const ThemeProvider: FC<Props> = ({ children }) => {
	const [_theme, setTheme] = useState(ThemeType.Light)
	return (
		<ThemeContext.Provider
			value={{
				theme: _theme === ThemeType.Light ? ligthTheme : darkTheme,
				setTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	)
}
