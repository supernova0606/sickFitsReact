import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import Item from './Item';
import { perPage } from '../config';
import { ALL_ITEMS_QUERY } from '../queries/index';

// export const itemEnhancer = graphql(ALL_ITEMS_QUERY, {
//   name: 'itemsQuery',
//   options({ page }) {
//     return {
//       variables: ,
//     };
//   },
// });

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

const Center = styled.div`
  text-align: center;
`;

class ItemList extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
  };
  componentDidUpdate(lastProps) {
    if (lastProps.page === this.props.page) return;
    // update the query
    console.log('This fires, and should update the query');
  }
  render() {
    return (
      <Center key={this.props.page}>
        <Pagination page={this.props.page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: this.props.page * perPage - perPage,
            first: perPage,
          }}
        >
          {({ data, error, loading, variables }) => {
            if (loading) return <div>Loading</div>;
            if (error) return <div>Error</div>;
            return (
              <Items key={this.props.page}>{data.items.map((item, i) => <Item key={item.id} item={item} />)}</Items>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

// export default compose(itemEnhancer)(ItemList);
export default ItemList;
