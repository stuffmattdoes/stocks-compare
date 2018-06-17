import React, { Component } from 'react';

class Search extends Component {
    render() {
        return (
            <form className='search' onSubmit={this.onSubmit} >
                <input autoComplete='off' className='search__input' id='Search__Input'  placeholder='Search' ref={node => this.searchInput = node} />
                { err ?
                    <label className='search__label search__label--error' htmlFor='Search__Input'>There was an error fetching information for this stock. Try another one.</label>
                : null }
            </form>
        );
    }
}

export default Search;
