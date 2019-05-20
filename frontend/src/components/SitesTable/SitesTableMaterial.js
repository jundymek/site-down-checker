import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { deleteSite, refreshSite } from '../../actions/siteActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textTransform: 'uppercase',
        padding: '10px 10px',
        fontSize: 12,
    },
    body: {
        fontSize: 14,
        padding: '10px 10px',
    },
}))(TableCell);


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 1,
        overflowX: 'auto',
        borderRadius: 0,
        backgroundColor: '#f4f0e6'
    },
    table: {
        borderRadius: 0,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#d9d9f3',
        },
    },
    dissapear: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    button: {
        marginLeft: -10
    }
});


class CustomizedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    deleteSite = (id) => {
        const url = `http://127.0.0.1:8000/api/sites/${id}/`
        axios.delete(url, {
            headers: { 'Authorization': `Token ${this.props.token}` }
        })
            .then(() => {
                this.props.deleteSite(id)
                setTimeout(() => alert('Url was deleted'), 1000)
            })
            .catch(error => {
                console.log(error);
            });
    }

    refreshSite = (id, index) => {
        this.setState({ loading: true })
        const url = `http://127.0.0.1:8000/api/sites/${id}/`
        axios.put(url, {}, {
            headers: { 'Authorization': `Token ${this.props.token}` }
        })
            .then(response => {
                let data = response.data
                this.props.refreshSite(id, index, data)
                this.setState({ loading: false })
            })
            .catch(error => {
                console.log(error);
            });
    }

    refreshAll = () => {
        for (let i = 0; i < this.props.sites.length; i++) {
            let id = this.props.sites[i]['id']
            let index = i
            this.refreshSite(id, index)
        }
    }

    render() {
        const { classes } = this.props;
        const siteList = this.props.sites.length
            ? this.props.sites.map((site, index) => {
                return (
                    <TableRow className={classes.row} key={site.id}>
                        <CustomTableCell>{index + 1}</CustomTableCell>
                        <CustomTableCell align="left"><Link to={{
                            pathname: `/site/${site.id}`,
                            state: {
                                site: site,
                                id: index
                            }
                        }}>{site.url}</Link></CustomTableCell>
                        <CustomTableCell align="left">{site.last_status ? site.last_status : 'None'}</CustomTableCell>
                        <CustomTableCell className={classes.dissapear} align="left">{site.last_response_time ? site.last_response_time : 'None'}</CustomTableCell>
                        <CustomTableCell className={classes.dissapear} align="left">{site.last_check.slice(0, 16).replace("T", " ")}</CustomTableCell>
                        <CustomTableCell align="left">
                            <IconButton className={classes.button} title="Refresh" color="primary" onClick={e => this.refreshSite(site.id, index)}>
                                <RefreshIcon />
                            </IconButton>
                        </CustomTableCell>
                        <CustomTableCell align="left">
                            <IconButton className={classes.button} title="Delete" color="primary" onClick={e => this.deleteSite(site.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CustomTableCell>
                    </TableRow>
                );
            })
            : null;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>#</CustomTableCell>
                            <CustomTableCell align="left">Url</CustomTableCell>
                            <CustomTableCell align="left">Last status</CustomTableCell>
                            <CustomTableCell className={classes.dissapear} align="left">Last response time</CustomTableCell>
                            <CustomTableCell className={classes.dissapear} align="left">Last checked</CustomTableCell>
                            <CustomTableCell></CustomTableCell>
                            <CustomTableCell></CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {siteList}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    return {
        token: state.token,
        sites: state.sites
    }
}

const mapDispatchToProps = {
    deleteSite,
    refreshSite,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomizedTable));