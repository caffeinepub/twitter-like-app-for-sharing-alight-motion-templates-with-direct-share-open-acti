import Map "mo:core/Map";
import MigrationTypes "migration_types";

module {
  type OldActor = MigrationTypes.OldActor;
  type NewActor = MigrationTypes.NewActor;

  public func run(old : OldActor) : NewActor {
    { old with appCustomizationSettings = null };
  };
};
