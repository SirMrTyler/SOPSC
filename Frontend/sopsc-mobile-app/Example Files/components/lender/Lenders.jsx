import React, { useState, useEffect, useCallback } from "react";
import debug from "sabio-debug";
import Lender from "./lender";
import lendersService from "services/lenderService";
import { CardGroup, Button, FormControl, Card } from "react-bootstrap";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

function Lenders() {
    const _logger = debug.extend("Lenders")
    _logger('test')
    const [pageData, setPageData] = useState({ lenders: [] });
    const [pageValue, setPageValue] = useState({ inputValue: "", pageIndex: 1, totalCount: 0, searchTerm: "" });
    const pageSize = 8;

    const onEditClicked = useCallback((id) => {
        _logger.log(id)
    })

    const mapLender = (aLender) => {
        return <Lender theLender={aLender} onEditClicked={onEditClicked} key={"listA" + aLender.id}></Lender>
    }

    useEffect(() => {
        lendersService.getPageSearch(pageValue.pageIndex, pageSize, pageValue.searchTerm)
            .then(onGetLenderSuccess)
            .catch(onGetLenderError)
    }, [pageValue.pageIndex])

    const onGetLenderSuccess = (response) => {
        let newLenders = response.data.item.pagedItems;
        setPageValue(prevState => {
            return {
                ...prevState,
                totalCount: response.data.item.totalCount
            }
        });
        setPageData(prevState => {
            return {
                ...prevState,
                lenders: newLenders
            }
        });
    }

    const onGetLenderError = (response) => {
        _logger(response)
    }

    const handlePageChange = (page) => {
        setPageValue(prevState => {
            return {
                ...prevState,
                pageIndex: page
            }
        });
    }

    const handleSearch = () => {
        setPageValue(prevState => {
            return {
                ...prevState,
                searchTerm: pageValue.inputValue,
                pageIndex: 1
            }
        });
    }

    return (
        <React.Fragment>
            <h1>Lenders View</h1>
            <div className="container">
                <div className="row col-md-6 mx-auto">
                    <FormControl
                        type="text"
                        placeholder="Search"
                        className="col-md-6 mr-sm-2"
                        value={pageValue.inputValue}
                        onChange={(e) =>
                            setPageValue(prevState => {
                                return {
                                    ...prevState,
                                    inputValue: e.target.value
                                }
                            })
                        }
                    />
                    <Button variant="outline-success" onClick={handleSearch}>Search</Button>
                    <Pagination className="pb-3 pt-3"
                        onChange={handlePageChange}
                        current={pageValue.pageIndex}
                        total={pageValue.totalCount}
                        pageSize={pageSize}
                    />
                </div>
            </div>
            <Card className="col-md-10 mx-auto">
                <CardGroup>
                    <div className="container">
                        <div className="row">
                            {pageData.lenders.map(mapLender)}
                        </div>
                    </div>
                </CardGroup>
            </Card>
        </React.Fragment>
    )
}

export default Lenders;
