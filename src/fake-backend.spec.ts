import { TestBed, inject } from '@angular/core/testing';
import { FakeBackend } from '../';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GithubService {
  constructor(private http: Http) {}

  getProfile(userName: string) {
    return this.http
      .get(`users/${userName}`)
      .map((response: Response) => response.json());
  }

  login(username: string, password: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });

    return this.http
      .post('usernamepassword/login', { username, password }, options)
      .map((response: Response) => response.text());
  }
}

describe('GithubServiceRefactored', () => {
  let subject: GithubService;
  let backend: FakeBackend;
  let profileInfo = {
    login: 'blacksonic',
    id: 602571,
    name: 'Gábor Soós'
  };
  let responseForm = '<form />';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GithubService,
        FakeBackend.getProviders()
      ]
    });
  });

  beforeEach(inject([GithubService, FakeBackend], (github: GithubService, fakeBackend: FakeBackend) => {
    subject = github;
    backend = fakeBackend;
  }));

  it('should get profile data of user', (done) => {
    backend.expectGET('users/blacksonic').respond(profileInfo);

    subject.getProfile('blacksonic').subscribe((response) => {
      expect(response).toEqual(profileInfo);
      done();
    });
  });

  it('should be called with proper arguments', (done) => {
    backend.expectPost(
      'usernamepassword/login',
      { username: 'blacksonic', password: 'secret' },
      { 'Content-Type': 'application/json' }
    ).respond(responseForm);

    subject.login('blacksonic', 'secret').subscribe((response) => {
      expect(response).toEqual(responseForm);
      done();
    });
  });

  it('should not respond automatically when turned off', (done) => {
    backend.setAutoRespond(false);
    backend.expectPost(
      'usernamepassword/login',
      { username: 'blacksonic', password: 'secret' },
      { 'Content-Type': 'application/json' }
    ).respond(responseForm);

    subject.login('blacksonic', 'secret').subscribe((response) => {
      expect(response).toEqual(responseForm);
      done();
    });

    backend.flush();
  });

  it('should verify pending expectations', () => {
    backend.expectPost(
      'usernamepassword/login',
      { username: 'blacksonic', password: 'secret' },
      { 'Content-Type': 'application/json' }
    ).respond(responseForm);

    try {
      backend.verifyNoPendingEpectations();
      throw new Error('should throw');
    } catch(e) {
      expect(e.message).toEqual('Pending expectations found: 1');
    }
  });

  it('should verify pending connections', () => {
    backend.setAutoRespond(false);

    subject.login('blacksonic', 'secret').subscribe(() => {});

    try {
      backend.verifyNoPendingRequests();
      throw new Error('should throw');
    } catch(e) {
      expect(e.message).toEqual('Pending connections found: 1');
    }
  });
});
