// 기본 스킬
type Skill = {
    id: number;
    name: string;
};

// 기본 스킬 모든 리스트
type AllKindOfSkills = {
    category: string;
    skills: Skill[];
}

// 카테고리별 모든 스킬 리스트
declare type AllKindOfRoadmapSkills = {
    category: string;
    skills: RoadmapSkill[];
}

// 로드맵 구성을 위한 각 스킬 노드
declare type RoadmapSkill = {
    id: number;
    name: string;
    parent?: number[];
    child?: number[];
    position: [number, number];
    tag: string;
};


type SkillStatus = 'not-started' | 'in-progress' | 'completed';

// 스킬 목차 구성
type SkillTopic = {
    id: number;
    title: string;
    subtitle: string[];
    status: SkillStatus;
}

// 스킬 전체 상세설명
declare type SkillDetail = {
    id: number;
    name: string;
    description: string;
    list: SkillTopic[];
}
export declare const skillSelectedTags: {
    해당안됨 : 'none';
    기본언어: 'basic';
    프레임워크: 'framework';
    연결과API:'connection';
    테스트: 'test';
};

type quiz = {
    question: string;
    options: string[];
    answer: number;
};

//mypage 하위의 RoadmapCustomize 파일에서 재사용
export type SkillSelectUnion=
    typeof skillSelectedTags[keyof typeof skillSelectedTags];