// Faz sentido componentizar os messages? Reanalisar esta parte futuramente
import {useState, useEffect} from 'react';

interface MessageProps {
  message: string;
  type: 'error' | 'success' | 'transcription';
}

export const Message = ({ message, type }: MessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`message ${type}`}>
      {message}
    </div>
  );
}