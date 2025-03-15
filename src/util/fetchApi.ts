import api from "./api"

const getArticle = async () => {
    let params = { id: 1 }; // 기본값 설정
    return await api.get(`/articles/${params.id}`)
        .then((response) => response.data.data.article);
}

export default getArticle;