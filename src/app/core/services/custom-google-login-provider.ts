import { LoginProvider, SocialUser } from 'angular4-social-login';

declare let gapi: any;

export class CustomGoogleLoginProvider implements LoginProvider {
  public static readonly PROVIDER_ID: string = 'GOOGLE';

  protected auth2: any;

  constructor(private clientId: string) {}

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(CustomGoogleLoginProvider.PROVIDER_ID, '//apis.google.com/js/platform.js', () => {
        gapi.load('auth2', () => {
          this.auth2 = gapi.auth2.init({
            client_id: this.clientId,
            scope: 'email'
          });

          this.auth2.then(() => {
            if (this.auth2.isSignedIn.get()) {
              const user: SocialUser = new SocialUser();
              const profile = this.auth2.currentUser.get().getBasicProfile();
              const token = this.auth2.currentUser.get().getAuthResponse(true).id_token;

              user.id = profile.getId();
              user.name = profile.getName();
              user.email = profile.getEmail();
              user.photoUrl = profile.getImageUrl();
              user.firstName = profile.getGivenName();
              user.lastName = profile.getFamilyName();
              user.authToken = token;
              resolve(user);
            }
          });
        });
      });
    });
  }

  signIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      const promise = this.auth2.signIn();

      promise.then(() => {
        const user: SocialUser = new SocialUser();
        const profile = this.auth2.currentUser.get().getBasicProfile();
        const token = this.auth2.currentUser.get().getAuthResponse(true).id_token;

        user.id = profile.getId();
        user.name = profile.getName();
        user.email = profile.getEmail();
        user.photoUrl = profile.getImageUrl();
        user.authToken = token;
        resolve(user);
      });
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth2.signOut().then((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  loadScript(id: string, src: string, onload: any): void {
    if (document.getElementById(id)) {
      return;
    }

    const signInJS = document.createElement('script');
    signInJS.async = true;
    signInJS.src = src;
    signInJS.onload = onload;
    document.head.appendChild(signInJS);
  }
}
