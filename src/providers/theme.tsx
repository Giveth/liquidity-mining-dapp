import { createContext, FC, ReactNode, useState } from 'react'

export enum ThemeType {
	Light,
	Dark,
}

export const ThemeContext = createContext({
	theme: ThemeType.Light,
	setTheme: function (theme: ThemeType) {
		console.log('ThemeContextSetState Not Impemented ')
	},
})

type Props = {
	children?: ReactNode
}

export const ThemeProvider: FC<Props> = ({ children }) => {
	const [theme, setTheme] = useState(ThemeType.Light)
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
