// Faz sentido componentizar os messages? Reanalisar esta parte futuramente
export const ErrorMessage = ({ message }: { message: string }) => {
  return <p style={{ color: 'red' }}>{message}</p>
}

export const SuccessMessage = ({ message }: { message: string }) => {
  return <p style={{ color: 'green' }}>{message}</p>
}