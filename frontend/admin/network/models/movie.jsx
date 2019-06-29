export class DashboardMovie {
    constructor(name, type, director, theater, showTime) {
        this.name = name
        this.type = type
        this.director = director
        this.theater = theater
        this.showTime = showTime
    }
}

export class Movie {
    constructor(id, name, director, actor, type, length, start, end, intro, imageUrl) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.director = director;
        this.actor = actor;
        this.length = length;
        this.start = start;
        this.end = end;
        this.intro = intro
        this.imageUrl = imageUrl
    }
}