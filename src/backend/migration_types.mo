import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";

module {
  type CustomizationSettings = {
    theme : Text;
    primaryColor : Text;
    logoUrl : Text;
  };
  public type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    likes : Map.Map<(Principal, Nat), Bool>;
    premiumSubscriptions : Map.Map<Principal, Bool>;
    userProfiles : Map.Map<Principal, { username : Text; fullName : Text }>;
  };
  public type NewActor = OldActor and {
    appCustomizationSettings : ?CustomizationSettings;
  };
};
