import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className='container'>
      <h1 className='heading'>404 - Página Não Encontrada</h1>
      <p>Desculpe, a página que você está tentando acessar não existe.</p>
      <Link to="/" className='link'>
        <button className='button'>Voltar para a Página Inicial</button>
      </Link>
    </div>
  );
};

export default NotFound;