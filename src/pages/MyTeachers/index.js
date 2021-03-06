import React, { useEffect } from 'react';
import _ from 'lodash';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { List, Skeleton, Card } from 'antd';
import UserAvatar from '@/components/Avatar';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import LoadMore from '@/components/LoadMoreButton';
import { loadingData } from '@/utils/utils';
import styles from './index.less';

const { Meta } = Card;

const Teacher = ({ teacher }) => {
    return (
        <Card
            className={styles.teacher}
            hoverable
            style={{ width: '100%', borderRadius: '6px' }}
        >
            <Meta
                avatar={<UserAvatar src={teacher.avatar} text={teacher.name} textSize={48} borderWidth={0} alt="avatar" size={48} style={{ background: 'white', color: 'black' }} />}
                title={<Link to="/teaching">{teacher.name}</Link>}
                description={`${teacher.numOfCourses} courses, ${teacher.numOfStudents} students`}
            />
        </Card>
    );
};

const MyTeachers = ({ dispatch, ...props }) => {
    let {
        hasMore,
        teachers,
        initLoading,
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'teachers/fetch'
        });
        return () => dispatch({
            type: 'teachers/reset'
        });
    }, []);
    const handleMoreTeachers = () => {
        dispatch({
            type: 'teachers/more'
        });
    };
    const handleAllTeachers = () => {
        dispatch({
            type: 'teachers/all'
        });
    };
    const loadMore = (
        <LoadMore
            when={!loading && !initLoading && teachers && hasMore}
            className={styles.loadMore}
            onMore={handleMoreTeachers}
            onAll={handleAllTeachers}
            itemName="teacher"
        />
    )
    if (loading)
        teachers = loadingData(teachers, 'teacher_loading', 3);
    return (
        <Wrapper title="My teachers">
            <div className={styles.myTeachers}>
                <Spin spinning={initLoading} fontSize={8} isCenter>
                    <List
                        dataSource={!teachers ? [] : teachers}
                        rowKey={item => (item._id || item.key)}
                        loadMore={loadMore}
                        grid={{
                            column: 3,
                            gutter: 8
                        }}
                        renderItem={item => (
                            <div className={!item.loading ? styles.teacherItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/teacher/${item._id}` ) : () => {}}>
                                <List.Item style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    {item.loading ? (
                                        <Card
                                            style={{ width: '100%', borderRadius: '6px' }}
                                        >
                                            <Skeleton active title={false} avatar loading={item.loading} className={styles.skeletonCard}
                                                paragraph={{
                                                    rows: 2,
                                                    width: ['60%', '80%']
                                                }}
                                            />
                                        </Card>
                                    ) : (
                                        <Teacher teacher={item} />
                                    )}                                    
                                </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ teachers, loading }) => ({
        teachers: teachers.list,
        hasMore: teachers.hasMore,
        initLoading: !!loading.effects['teachers/fetch'],
        loading: !!loading.effects['teachers/more'] || !!loading.effects['teachers/all']
    })
)(MyTeachers);