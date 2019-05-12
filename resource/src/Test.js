import React, {Component} from 'react';

import './test.scss'
import {Icon, Input, List, Spin} from "antd";

const Search = Input.Search;

class Test extends Component {
    state = {
        show: false,
        list: [
            {
                name: 'Finansportalen API',
                des: 'Finansportalen is a site provided by the Norwegian Consumer Protection Agency to  provide consumers the ability to make good choices in the market for financial services. The portal is a tool that helps consumers to compare financial industry products The Finansportalen API exposes data feeds on financial products for the Norwegian market. An account is required to view the URLs for data feeds.',
                url: 'https://www.finansportalen.no/feed/v2'
            }, {
                name: 'Google Maps API',
                des: '[This API is no longer available. Google Maps\' services have been split into multiple APIs, including the Static Maps API, Street View Image API, Directions APIs, Distance Matrix API, Elevation API, Geocoding API, Geolocation API, Places API, Roads API, and Time Zone API.\n' +
                    '\n' +
                    'This page is maintained purely for historical and research purposes.]\n' +
                    '\n' +
                    'The Google Maps API allow for the embedding of Google Maps onto web pages of outside developers, using a simple JavaScript interface or a Flash interface. It is designed to work on both mobile devices as well as traditional desktop browser applications. The API includes language localization for over 50 languages, region localization and geocoding, and has mechanisms for enterprise developers who want to utilize the Google Maps API within an intranet. The API HTTP services can be accessed over a secure (HTTPS) connection by Google Maps API Premier customers.',
                url: 'https://www.google.com/maps/embed/v1/'
            }, {
                name: 'Google Analytics Metadata AP',
                des: 'The Google Analytics Metadata API returns a list of columns and their attributes from the Google Analytics reporting APIs. Column attributes are Analytics View (profile) dimensions and metrics. The API uses HTTP GET with JSON for returns/responses. Use the Metadata API to get attributes like UI name, description, segments, or support, or to discover new columns.',
                url: 'https://www.googleapis.com/analytics/v3'
            }

        ],
        spin: false
    }

    show() {
        this.openSpin()

        setTimeout(() => {
            this.setState({
                show: true
            })
            this.closeSpin()
        }, 2000)


    }

    openSpin() {
        this.setState({
            spin: true
        })

    }

    closeSpin() {
        this.setState({
            spin: false
        })
    }

    render() {


        return (
            <div className="container">
                <Spin spinning={this.state.spin}>
                    {
                        !this.state.show ? (
                            <div className="child">
                                <Search
                                    placeholder="请输入你的需求，我们会帮你找到你想要的服务"
                                    enterButton="搜索"
                                    size="large"
                                    onSearch={() => this.show()}
                                />
                            </div>
                        ) : (
                            <div className="detail">
                                <List
                                    itemLayout="vertical"
                                    size="large"

                                    dataSource={this.state.list}
                                    renderItem={item => (
                                        <List.Item
                                            key={item.name}


                                        >
                                            <List.Item.Meta
                                                title={<a href=''>{item.name}</a>}
                                                description={item.url}
                                            />
                                            {item.des}
                                        </List.Item>
                                    )}
                                />

                            </div>
                        )

                    }
                </Spin>

            </div>


        )
    }


}


export default Test