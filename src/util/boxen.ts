import boxen from 'boxen'

export const displayBoxUI = (textToDisplay: string): void => {
  console.log(
    boxen(textToDisplay, {
      padding: 1,
      borderColor: 'magenta',
      borderStyle: {
        topLeft: '╭',
        topRight: '╮',
        bottomRight: '╯',
        bottomLeft: '╰',
        vertical: '│',
        horizontal: '─',
      },
    })
  )
}
