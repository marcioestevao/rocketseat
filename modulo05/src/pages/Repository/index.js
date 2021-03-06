import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../component/Container';
import { Loading, Owner } from './styles';

export default class Repository extends Component {
  // Proptypes serve para informar ao react o tipo de parametros que está
  // recebendo
  // match = é um objeto(shape)
  // params: = é um objeto(shape)
  // repository: = é uma string

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // const response = await api.get(`/repos/${repoName}`);
    // const issues = await api.get(`/repos/${repoName}/issues`);

    // Como acima uma chamada não depende da outra, as mesmas podem ser chamadas no mesmo momento da seguinte maneira:
    const [repository, issues] = await Promise.all([
      await api.get(`/repos/${repoName}`),
      await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    // Enquanto a variável loading estiver true, executa o que está dentro do if
    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repósitórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
      </Container>
    );
  }
}
