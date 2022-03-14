import React from "react"
import './searchusers.css'
function SearchUsersList(){
    return (
        <div id="SearchUsersList">
            <input id="search"/>
            <div id='search-users-container'></div>
        </div>
    )
}

export default SearchUsersList;