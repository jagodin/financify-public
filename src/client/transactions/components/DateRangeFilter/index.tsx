import { useEffect, useState, SetStateAction, Dispatch } from 'react';
import moment, { Moment } from 'moment';
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import TSwiper from 'swiper';
import { DayIcon, MonthIcon } from './components/icons';
import _ from 'lodash';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import 'swiper/swiper.scss'; // core Swiper

import { Row, Col } from 'antd';

import { DateMode } from '../../index';

type DateRangeFilerProps = {
    mode: DateMode;
    setDate: Dispatch<SetStateAction<Moment>>;
    date: Moment;
    swiper: TSwiper | undefined;
    setSwiper: Dispatch<SetStateAction<TSwiper | undefined>>;
    dates: Moment[] | undefined;
    setDates: Dispatch<SetStateAction<moment.Moment[] | undefined>>;
    indexOffset: number;
    setIndexOffset: Dispatch<SetStateAction<number>>;
};

const buttonArrowStyle: React.CSSProperties = {
    fontSize: 24,
    cursor: 'pointer',
};

const getIcon = (
    mode: DateMode,
    key: string | number,
    date: Moment,
    selected: boolean
) => {
    switch (mode) {
        case 'day':
            return <DayIcon selected={selected} date={date} key={key} />;
        case 'month':
            return <MonthIcon selected={selected} date={date} key={key} />;
        default:
            return <MonthIcon selected={selected} date={date} key={key} />;
    }
};

const DateRangeFilter = ({
    mode,
    setDate,
    date,
    swiper,
    setSwiper,
    dates,
    setDates,
    indexOffset,
    setIndexOffset,
}: DateRangeFilerProps) => {
    const [index, setIndex] = useState<number>(0);
    const [slidesPerView, setSlidesPerView] = useState<number>(7);

    useEffect(() => {
        switch (mode) {
            case 'day': {
                const range = _.range(-365, 365, 1);
                setDates(
                    range.map((offset) => moment(date).add(offset, 'days'))
                );
                setIndexOffset(3);
                setSlidesPerView(7);
                break;
            }
            case 'month': {
                const range = _.range(-24, 24, 1);
                setDates(
                    range.map((offset) => moment(date).add(offset, 'months'))
                );
                setIndexOffset(3);
                setSlidesPerView(7);
                break;
            }
            default: {
                const range = _.range(-36, 36, 1);
                setDates(
                    range.map((offset) => moment(date).add(offset, 'months'))
                );
                setIndexOffset(3);
                setSlidesPerView(7);
                break;
            }
        }
    }, []);

    useEffect(() => {
        if (dates && swiper) {
            const index = Math.floor(dates.length / 2);
            swiper.slideTo(index - indexOffset, 0);
        }
    }, [swiper]);

    useEffect(() => {
        if (dates) {
            setDate(dates[index + indexOffset]);
            pushDateParams(dates[index + indexOffset]);
        }
    }, [index]);

    const pushDateParams = (date: Moment) => {
        const url = new URL(window.location.href);
        const month = moment(date).format('MM');
        const year = moment(date).format('YYYY');
        url.searchParams.set('month', moment(month).format('MM'));
        url.searchParams.set('year', moment(year).format('YYYY'));
        window.history.pushState({}, '', url.href);
    };

    const handleOnInit = (swiper: TSwiper) => {
        if (swiper) {
            setSwiper(swiper);
        }
    };

    const handleOnIndexChange = (swiper: TSwiper) => {
        setIndex(swiper.realIndex);
    };

    return (
        <div style={{ paddingTop: 10 }}>
            <Row justify='space-between' align='middle'>
                <Col>
                    <LeftOutlined
                        onClick={() => {
                            swiper?.slidePrev();
                        }}
                        style={buttonArrowStyle}
                        className='swiper-btn'
                    />
                </Col>
                <Col span={22}>
                    <Swiper
                        slidesPerView={slidesPerView}
                        onInit={handleOnInit}
                        onRealIndexChange={handleOnIndexChange}
                        virtual
                        modules={[Virtual]}
                    >
                        {dates?.map((slide, i) => {
                            return (
                                <SwiperSlide
                                    onClick={() => {
                                        swiper?.slideTo(i - indexOffset);
                                    }}
                                    virtualIndex={i}
                                    key={i}
                                >
                                    {getIcon(
                                        mode,
                                        i,
                                        slide,
                                        index + indexOffset == i
                                    )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Col>
                <Col>
                    <RightOutlined
                        onClick={() => {
                            swiper?.slideNext();
                        }}
                        style={buttonArrowStyle}
                        className='swiper-btn'
                    />
                </Col>
            </Row>
        </div>
    );
};

export { DateRangeFilter };
