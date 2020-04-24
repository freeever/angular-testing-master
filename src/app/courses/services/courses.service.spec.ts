import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import { COURSES, LESSONS, findLessonsForCourse } from './../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

xdescribe('CoursesService', () => {

  // Store the provider and an instance of the HttpTestingController (httpMock) in variables so we can have access to them in each test
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });
    // Inject srvice (which imports the HttpClient) and the Test Controller which to mock request
    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    console.log('Calling findAllCourses.........');
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'incorrect number of courses');
        const course = courses.find(course => course.id === 12);
        expect(course.titles.description).toBe('Angular Testing Course');
      });

      // Tell the httpMock what's the HTTP method we expect to be sent and the endpoint's URL.
      const req = httpTestingController.expectOne('/api/courses');
      expect(req.request.method).toBe('GET');

      // Set the fake data to be returned by the mock
      req.flush({ payload: Object.values(COURSES) });
  });

  it('should retrieve a course by id', () => {
    console.log('Calling find a course by id.........');
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toBe('GET');

      // Set the fake data to be returned by the mock
      req.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' }};
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12);
        expect(course.titles.description).toBe('Testing Course');
      });

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body.titles.description).toEqual(changes.titles.description);
      req.flush({
        ...COURSES[12],
        ...changes
      });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        fail('the save course operation shoudl have failed');
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);

        expect(error.status).toBe(500);
      });

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toEqual('PUT');
      req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

      // Since the real url will be /api/lessons?courseId=xxx&...., so put '/api/lessons'
      // will not match the real url.
      const req = httpTestingController.expectOne(
        req => req.url === '/api/lessons');

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('courseId')).toEqual('12');
      expect(req.request.params.get('filter')).toEqual('');
      expect(req.request.params.get('sortOrder')).toEqual('asc');
      expect(req.request.params.get('pageNumber')).toEqual('0');
      expect(req.request.params.get('pageSize')).toEqual('3');

      req.flush({
        payload: findLessonsForCourse(12).slice(0, 3)
      });
  });

  afterEach(() => {
    // Guarantee only the above http request in 'expectOne' is called
    httpTestingController.verify();
  });

});
