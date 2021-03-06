import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Layout, Menu, Checkbox, Skeleton, Row, Spin, Icon, Button } from 'antd';
import { YoutubeFilled, ReadFilled, PlayCircleFilled } from '@ant-design/icons';
import router from 'umi/router';
import Link from 'umi/link';
import ScrollLayout from '@/components/ScrollLayout';
import { secondsToTime, secondToTime2, transAuthors } from '@/utils/utils';
import styles from './index.less';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Header = ({ loading, name, authors, courseId }) => {
    return (
        <div className={styles.header}>
            <Row className={styles.info}>
                <div className={styles.name}>
                    <Skeleton loading={loading} active title={false} paragraph={{ rows: 1, width: '25%' }} className={styles.skeleton}>
                        <Link to={`/course/${courseId}`}>{name}</Link>
                    </Skeleton>
                </div>
                <div className={styles.authors}>
                    <Skeleton loading={loading} active title={false} paragraph={{ rows: 1, width: '18%' }}>
                        {`Created by ${transAuthors(authors)}`}
                    </Skeleton>
                </div>
                <div className={styles.btns}>
                    {!loading && (
                        <Button className={styles.backToHome} type="primary" onClick={() => router.push('/')}>
                            Back to home
                        </Button>
                    )}
                </div>
            </Row>

        </div>
    )
};


const LearningLayout = ({ children, match, location, dispatch, ...props }) => {
    const { courseId, chapterId } = match.params;
    const {
        courseInfo,
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchInfo',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetInfo' });
    }, [courseId]);
    const handleToggleLectureStatus = (chapterId, lectureId, value) => {
        dispatch({
            type: 'learning/toggleComplete',
            payload: {
                courseId,
                chapterId,
                lectureId,
                value
            }
        });
    };
    let openKeys;
    if (courseInfo) {
        openKeys = _.map(courseInfo.syllabus, chapter => chapter._id);
    }
    return (
        <Layout className={styles.learningLayout}>
            <Header loading={!courseInfo || courseInfo.loading} name={courseInfo && courseInfo.title} authors={courseInfo && courseInfo.authors} courseId={courseInfo && courseInfo._id} />
            <ScrollLayout>
                <Sider
                    className={styles.sider}
                    width={350}
                >
                    {!courseInfo || loading ? (
                        <div className={styles.inlineDiv}>
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 44 }} spin />} />
                        </div>
                    ) : (
                        <Menu
                            mode="inline"
                            className={styles.menu}
                            defaultOpenKeys={openKeys}
                            selectedKeys={[_.replace(location.pathname, match.url, '')]}
                        >
                            <MenuItem key="/overview">
                                <Link to={`${match.url}/overview`}>Overview</Link>
                            </MenuItem>
                            <MenuItem key="/forum">
                                <Link to={`${match.url}/forum`}>Forum</Link>
                            </MenuItem>
                            <MenuItem key="/announcements">
                                <Link to={`${match.url}/announcements`}>Announcements</Link>
                            </MenuItem>
                            <MenuItem key="/review">
                                <Link to={`${match.url}/review`}>Review</Link>
                            </MenuItem>
                            <MenuItem key="/instructor-review">
                                <Link to={`${match.url}/instructor-review`}>Instructor review</Link>
                            </MenuItem>
                          <MenuItem key="/messenger">
                            <Link to={`${match.url}/messenger`}>Chatting</Link>
                          </MenuItem>
                            {_.map(courseInfo.syllabus, chapter => (
                                <SubMenu key={chapter._id} title={chapter.title} className={styles.chapter} popupClassName={styles.subMenuPopup}>
                                    {_.map(chapter.lectures, lecture => (
                                        <MenuItem key={`/${chapter._id}/lecture/${lecture.type === 'Article' ? 'article' : 'video'}/${lecture._id}`} className={styles.lecture}>
                                            <div>
                                                <Link className={styles.name} to={`${match.url}/${chapter._id}/lecture/${lecture.type === 'Article' ? 'article' : 'video'}/${lecture._id}`}>
                                                    <span style={{ display: 'inline-block', marginRight: '3px' }}>
                                                        {lecture.type === 'Video' ? (
                                                            <PlayCircleFilled />
                                                        ) : (
                                                            <ReadFilled />
                                                        )}
                                                    </span>
                                                    <span>
                                                        {`${lecture.title} (${secondToTime2(lecture.duration)})`}
                                                    </span>
                                                </Link>
                                                <Checkbox checked={lecture.isCompleted} className={styles.status} onChange={e => handleToggleLectureStatus(chapter._id, lecture._id, e.target.checked)}/>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            ))}
                        </Menu>
                    )}
                </Sider>
                <Layout className={styles.content}>
                    <Content>
                        {children}
                    </Content>
                </Layout>

            </ScrollLayout>
        </Layout>
    )
};

export default connect(
    ({ learning, loading }) => ({
        courseInfo: learning.info,
        loading: !!loading.effects['learning/fetchInfo']
    })
)(LearningLayout);
