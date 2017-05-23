import React from 'react'
import Moment from 'moment'
import {Grid, Row, Col} from 'react-bootstrap'
import style from './styles/listItem.css'
import FontAwesome from 'react-fontawesome'
import {getTheme} from '../../helper/themeHelper'


export default class ListItem extends React.Component{

    constructor(props) {
        super(props);

        this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);

        this.state = {
            showIcons:false
        };
    }

    handleOnMouseEnter(){
        this.setState({
            showIcons:true
        })
    }

    handleOnMouseLeave(){
        this.setState({
            showIcons:false
        })
    }

    render(){
        const {item,index, activeIndex, icons, date} = this.props;

        const dateString = Moment(date).format("MM-DD-YYYY");
        const theme = getTheme();

        const {title, _id} = item;

        return (
            <div
                className={`${style.item} ${theme.sidebarList_item} ${index===activeIndex?`${theme.sidebarList_item_active} ${style.item_active}`:""}`}>
                <a href="#" key={_id} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>
                    <Grid className={`${style.container}`}>
                        <Row className={style.row}>
                            <Col className={style.col} xs={8}>
                                <div className={`${style.title} ${theme.sidebarList_item_title}`}>
                                    {title}
                                </div>
                            </Col>
                            {
                                 icons && this.state.showIcons?
                                    <Col className={`${style.col} ${style.iconContainer}`} xs={4}>

                                        {
                                            icons.map((icon)=>{
                                                return (
                                                    <FontAwesome className={`${style.icon} ${theme.sidebarList_item_icon}`}
                                                                 name= {`${icon.getName(item)}`}
                                                                 style={icon.style || null}
                                                                 onClick={(e) =>{
                                                                     const self=this;
                                                                     e.stopPropagation();
                                                                     this.setState({
                                                                         showIcons:false
                                                                     })
                                                                     icon.exec(index, item)
                                                                         .then(()=>{
                                                                             self.setState({
                                                                                 showIcons:true
                                                                             })
                                                                         })

                                                                 }}
                                                />)
                                            })
                                        }

                                    </Col>:<Col  className={style.col} xs={3}/>
                            }


                        </Row>
                        {
                            this.props.date ?
                                (<Row  className={style.row}>
                                    <span className={`${style.date} ${theme.sidebarList_item_date}`}>{dateString}</span>
                                </Row>): null
                        }

                        {
                            this.props.preview!==null ?
                                (<Row className={style.row}>
                                    <div className={`${style.preview} ${this.props.previewFull?style.preview_fullText:""} ${theme.sidebarList_item_preview}`}>
                                        {this.props.preview}
                                    </div>
                                </Row>):null
                        }
                    </Grid>
                </a>
            </div>
        )
    }
}