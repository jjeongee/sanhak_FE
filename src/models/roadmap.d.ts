import {RoadmapSkill} from "@/models/skill";

type CustomRoadmapName = {
    id: number;
    name: string;
    state: number;
}

// 커스텀로드맵 페이지 - 커스텀 로드맵
type CustomRoadmapDetail = {
    id?: number|null;
    name: string;
    skills: RoadmapSkill[];
};

type ChangeRoadmapDTO= {

}