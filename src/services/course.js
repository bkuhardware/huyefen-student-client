/* eslint-disable */
import { apiGet, apiPut, apiPost } from '@/utils/request';

export async function validCourse(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/validate/user`);
}

export async function fetchInfo() {}

export async function overview(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/overview`);
}

export async function instructors(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/instructors`);
}

export async function fetchChaptersDetail(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/chapters/detail`);
}

export async function fetchReviews(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews`);
}

export async function addReview({ courseId, starVal, comment }) {
    return apiPost(`${COURSE_API_URL}/${courseId}/reviews`, {
        body: {
            starRating: starVal,
            comment
        }
    });
}

export async function fetchInstructorReviews(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews/instructors`);
}

export async function reviewInstructor(courseId, { instructorId, starRating, ratingContent }) {
    return apiPut(`${COURSE_API_URL}/${courseId}/reviews/instructor`, {
        body: {
            instructorId,
            starRating,
            comment: ratingContent
        }
    });
}

export async function fetchOverviewPublic(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/overview/public`);
}

export async function fetchInstructorsPublic(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/instructors/public`);
}

export async function fetchPublicReviews(courseId, page = 1, limit = 8) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews/public?page=${page}&limit=${limit}`);
}

export async function voteReview(courseId, reviewId, value) {
    return apiPut(`${COURSE_API_URL}/${courseId}/reviews/${reviewId}/vote`, {
        body: {
            value
        }
    })
}

export async function fetchPublicInfo(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/info/public`);
}

export async function fetchInfoByLearner(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/info/learner`);
}

export async function fetchArticleLecture(courseId, chapterId, lectureId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/${chapterId}/article/${lectureId}/user`)
}

export async function fetchVideoLecture(courseId, chapterId, lectureId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/${chapterId}/video/${lectureId}/user`)
}

export async function setCompleteLectureStatus(courseId, chapterId, lectureId, value) {
    return apiPost(`${COURSE_API_URL}/${courseId}/${chapterId}/${lectureId}/completed`, {
        body: {
            status: value
        }
    });
}

export async function fetchSyllabusPublic(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/syllabus/public`);
}

export async function suggestCourses(keyword) {
    return apiGet(`${COURSE_API_URL}/suggest?keyword=${keyword}`);
}

export async function searchCourses(keyword, page = 1, pageSize = 8 ) {
    return apiGet(`${COURSE_API_URL}/search?keyword=${keyword}&page=${page}&pageSize=${pageSize}`);
}

export async function fetchRelatedCourses(courseId) {
  return apiGet(`${COURSE_API_URL}/${courseId}/related-courses`);
}

export async function submitView(courseId) {
  return apiPost(`${COURSE_API_URL}/${courseId}/submit-view`);
}

export async function fetchMessagesOfCourse(courseId, skip = 0, limit = 20) {
  return apiGet(`${COURSE_MESSENGER_API_URL}/${courseId}/messages?skip=${skip}&limit=${limit}`);
}

export async function sendCourseMessage(courseId, content) {
  return apiPost(`${COURSE_MESSENGER_API_URL}/${courseId}/messages`, {
    body: {
      content
    }
  });
}

export async function fetchMembersOfCourse(courseId, skip = 0, limit = 10) {
  return apiGet(`${COURSE_MESSENGER_API_URL}/${courseId}/members?skip=${skip}&limit=${limit}`);
}
