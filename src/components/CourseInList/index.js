import React from 'react';
import _ from 'lodash';
import router from 'umi/router';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Popover, Icon, Rate, Divider } from 'antd';
import FeaturedBadge from '@/components/FeaturedBadge';
import { truncate, transAuthors, roundStarRating, numberWithCommas } from '@/utils/utils';
import styles from './index.less';


const CourseInList = ({ course }) => {
    return (
        <Popover
            popupClassName={styles.coursePopover}
            placement="top"
            content={(
                <div>
                    <Row className={styles.lectureInfo}>
                        <Col className={styles.infoItem} span={12}>
                            <Icon type="container" theme="filled" />
                            <span>{`${course.numOfLectures} ${formatMessage({ id: 'course.lectures' })}`}</span>
                        </Col>
                        <Col className={styles.infoItem} span={12}>
                            <Icon type="rocket" theme="filled" />
                            <span>{formatMessage({ id: course.level })}</span>
                        </Col>
                    </Row>
                    {course.featured && (
                        <div className={styles.topic}>
                            <FeaturedBadge type={course.featured} style={{ marginRight: '12px' }}/>
                            in <Link to="/">{formatMessage({ id: course.topic })}</Link>
                            <Divider type="vertical" style={{ background: 'white' }} />
                            <span>{formatMessage({ id: course.category })}</span>
                        </div>
                    )}
                    <div className={styles.whatLearn}>
                        <div>What you'll learn</div>
                        <ul className={styles.list}>
                            {_.map(course.whatLearn, item => (
                                <li key={_.uniqueId('what_learn_')}>{truncate(item, 120)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            trigger="hover"
            mouseEnterDelay={0.6}
        >
            <Row className={styles.course} onClick={() => router.push(`/course/${course._id}`)}>
                <Col span={4} className={styles.avatar}>
                    {course.featured && (
                        <div className={styles.featured}>
                            <FeaturedBadge type={course.featured} />
                        </div>
                    )}
                    <img alt="avatar" src={course.avatar} />
                </Col>
                <Col span={16} className={styles.info}>
                    <div className={styles.name}>{course.name}</div>
                    <div className={styles.authors}>
                        {`Created by ${transAuthors(course.authors, 1000)}`}
                    </div>
                    <div className={styles.summary}>
                        {truncate(course.summary, 200)}
                    </div>
                </Col>
                <Col span={4} className={styles.extra}>
                    <div className={styles.price}>{`$${_.round(course.price, 2)}`}</div>
                    <div className={styles.starRating}>
                        <Rate disabled className={styles.star} allowHalf value={roundStarRating(course.starRating)}/>
                        <span className={styles.ratingVal}>{course.starRating}</span>
                    </div>
                    <div className={styles.countRating}>
                        {`(${numberWithCommas(course.numOfStarRatings)} ratings)`}
                    </div>
                </Col>
            </Row>
        </Popover>
    )
};

export default CourseInList;