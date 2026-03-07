import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  // Setup authentication and access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Booking type represented as raw JSON string
  type BookingJson = Text;

  // Storage for bookings by user principal
  let bookingsByUser = Map.empty<Principal, [BookingJson]>();

  // Save a new booking for the caller
  public shared ({ caller }) func saveBooking(bookingJson : BookingJson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can save bookings");
    };

    let currentBookings = switch (bookingsByUser.get(caller)) {
      case (null) { [] };
      case (?bookings) { bookings };
    };

    let updatedBookings = currentBookings.concat([bookingJson]);
    bookingsByUser.add(caller, updatedBookings);
  };

  // Get all bookings for the caller
  public query ({ caller }) func getMyBookings() : async [BookingJson] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can retrieve bookings");
    };

    switch (bookingsByUser.get(caller)) {
      case (null) { [] };
      case (?bookings) { bookings };
    };
  };
};
