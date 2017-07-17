import { POToolPage } from './app.po';

describe('potool App', () => {
  let page: POToolPage;

  beforeEach(() => {
    page = new POToolPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
