import { IProfileData, IProfileManagerStatus } from '~/shared';
import { makeListenerPort } from '~/shell/funcs';
import { PresetProfileLoader } from '~/shell/services/projects/PresetProfileLoader';
import { ProfileManager } from './ProfileManager/ProfileManager';
import { IProfileService } from './interfaces';

export class ProfileService implements IProfileService {
  profileManager: ProfileManager;

  constructor(presetProfileLoader: PresetProfileLoader) {
    this.profileManager = new ProfileManager(presetProfileLoader);
  }

  onCurrentProfileChanged = makeListenerPort<void>();

  getCurrentProfile(): IProfileData | undefined {
    return this.profileManager.getCurrentProfile();
  }

  private onProfileStatusChenged = (status: Partial<IProfileManagerStatus>) => {
    if (status.loadedProfileData) {
      this.onCurrentProfileChanged.emit();
    }
  };

  async initialize(): Promise<void> {
    await this.profileManager.initializeAsync();
    this.profileManager.statusEventPort.subscribe(this.onProfileStatusChenged);
  }

  async terminate(): Promise<void> {
    this.profileManager.statusEventPort.unsubscribe(
      this.onProfileStatusChenged,
    );
    await this.profileManager.terminateAsync();
  }
}
