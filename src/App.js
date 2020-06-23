import React, {useState, useEffect} from "react";
import api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  // Adicionar repositório
  async function handleAddRepository() {
     const response = await api.post('/repositories', {
       title: `New Project nº ${Date.now()}`,
       url: 'http://github.com/ficticiouslink',
       techs: ['React', 'ReactJS']
     });

     const newRepository = response.data;

     setRepositories([...repositories, newRepository]);
  }

  // Remover repositório
  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`);

    // Se a remoção foi bem sucedida, o back retorna o HTTP Code 204 (no content)
    if(response.status == 204){
      const repositoryIndex = repositories.findIndex(repository => repository.id == id);

      // Imutabilidade
      const updateRepository = [...repositories];
      updateRepository.splice(repositoryIndex, 1);

      setRepositories([...updateRepository]);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => 
            <li key={repository.id}>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>  
        )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
