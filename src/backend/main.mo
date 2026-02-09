import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var appCustomizationSettings : ?CustomizationSettings = null;

  type CustomizationSettings = {
    theme : Text;
    primaryColor : Text;
    logoUrl : Text;
  };

  // Comparison module for like keys
  module LikeKey {
    public func compare(l1 : (Principal, Nat), l2 : (Principal, Nat)) : Order.Order {
      switch (Principal.compare(l1.0, l2.0)) {
        case (#equal) { Nat.compare(l1.1, l2.1) };
        case (order) { order };
      };
    };
  };

  // User profile system
  public type UserProfile = {
    username : Text;
    fullName : Text;
  };
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Premium subscription system
  let premiumSubscriptions = Map.empty<Principal, Bool>();

  public query ({ caller }) func isCallerPremium() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check their premium status");
    };
    premiumSubscriptions.get(caller) == ?true;
  };

  public shared ({ caller }) func upgradeToPremium() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade to premium");
    };
    premiumSubscriptions.add(caller, true);
  };

  public shared ({ caller }) func cancelPremium() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel their premium subscription");
    };
    premiumSubscriptions.add(caller, false);
  };

  public shared ({ caller }) func setUserPremium(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant premium status");
    };
    premiumSubscriptions.add(user, true);
  };

  // Template system
  public type TemplateDraft = {
    name : Text;
    description : Text;
    thumbnail : Text;
    video : Text;
    alightMotionFileUrl : Text;
  };

  public type Template = TemplateDraft and {
    author : Principal;
  };

  module Template {
    public func compare(t1 : Template, t2 : Template) : Order.Order {
      Text.compare(t2.name, t1.name);
    };
  };

  // Post system
  public type PostDraft = {
    template : TemplateDraft;
    author : ?Principal;
    likes : Nat;
    reposts : Nat;
  };

  // Like system using the correct comparison function
  let likes = Map.empty<(Principal, Nat), Bool>();

  public shared ({ caller }) func likeTemplatePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    if (not likes.containsKey((caller, postId))) {
      likes.add((caller, postId), true);
    };
  };

  public shared ({ caller }) func repostTemplate(_postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can repost templates");
    };
  };

  public shared ({ caller }) func loginAdmin(passedLogin : Text, passedPassword : Text) : async Bool {
    // Require authenticated user (not anonymous/guest) to attempt admin login
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can attempt admin login");
    };
    if (passedLogin == "sahil@123" and passedPassword == "123@sahil") {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func logoutAdmin() : async () {
    // Verify caller is actually an admin before allowing logout
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can logout from admin role");
    };
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public shared ({ caller }) func saveCustomizationSettings(customizationSettings : CustomizationSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save customization settings");
    };
    appCustomizationSettings := ?customizationSettings;
  };

  public query ({ caller }) func getCustomizationSettings() : async ?CustomizationSettings {
    appCustomizationSettings;
  };
};
