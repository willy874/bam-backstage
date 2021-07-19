export const devErrorMessage = (error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `%c[Dirname: ${error.dir}]\n[Component: ${error.component}]\n[Function: ${error.func}]\nError: ${error.message}`,
      'color: #f00;padding: 2px 6px;'
    )
  }
}