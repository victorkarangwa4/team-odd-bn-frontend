import React from 'react';
import { connect } from 'react-redux';
import CommonTable from './CommonTable';
import Action from '../../components/Action';
import { searchResults, searchKey } from '../../redux/actions/search/searchAction';
import Status from '../../components/Status';
import { navs, tableHeads } from '../../constants/trips';
import { Paginate } from '../../helpers/Paginate';
import { handleFilter } from '../../helpers/filter';

const RequestsView = ({
  requestsData,
  pageNo,
  itemsPerPage,
  searchResults,
  searchKey,
  search,
}) => {
  const paginatedData = requestsData.data && { ...Paginate(requestsData.data, itemsPerPage) };
  const searchedData = search.payload;
  const { data } = requestsData;
  const entities = requestsData.data
    && (searchedData || paginatedData[pageNo]).map((request) => [

      { className: 'trip-type', attribute: request.tripType.tripType, key: 'tripType' },
      { className: 'statuses', attribute: <Status className={request.status.status} status={request.status.status} />, key: 'status' },
      { className: 'createdAt', attribute: request.createdAt.slice(0, 10), key: 'createdAt' },
      { className: 'action', attribute: <Action background="#34c6f3" url={`/requests/${request.id}`} action="View" />, key: 'action' }]);
  const userSearch = [
    <div className="searchOption">
      <select
        data-test="searchOption"
        className="search"
        defaultValue=""
        onChange={(e) => {
          searchKey(e.target.value);
        }}
      >
        <option value="" disabled>
          Search by
        </option>
        <option value="createdAt">Date requested</option>
        <option value="tripType">Trip type</option>
        <option value="status">Status</option>
        <option value="trips.origin">Origin</option>
        <option value="trips.destination">Destination</option>
      </select>
      <input
        data-test="dataFilter-test"
        className="search"
        id="searchInput"
        type="text"
        onChange={(e) => {
          const newData = handleFilter(e, data, search.key);
          searchResults(newData);
        }}
        disabled={!search.key && 'disabled'}
        placeholder="Search trips"
      />
    </div>,
  ];
  return (
    <CommonTable
      data={
        requestsData.data
        && Paginate(searchedData || requestsData.data, itemsPerPage)
      }
      navs={navs}
      tableHeads={tableHeads}
      entities={entities}
      userSearch={userSearch}
    />
  );
};
export const mapStateToProps = (state) => ({
  requestsData: state.trips.requests.requestsData,
  pageNo: state.pagination.pageNo,
  itemsPerPage: state.pagination.itemsPerPage,
  search: state.search,
});


export default connect(mapStateToProps, { searchResults, searchKey })(RequestsView);
