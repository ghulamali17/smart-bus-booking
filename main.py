SUPPORTED_CITIES = ("Karachi", "Hyderabad", "Sukkur", "Mirpur Khas", "Lahore")

routes = [
    {
        "route_id": "R101",
        "departure_city": "Karachi",
        "destination_city": "Hyderabad",
        "departure_time": "08:00 AM",
        "ticket_price": 1200,
        "total_seats": 40,
        "available_seats": 40,
    },
    {
        "route_id": "R102",
        "departure_city": "Karachi",
        "destination_city": "Sukkur",
        "departure_time": "09:30 AM",
        "ticket_price": 2000,
        "total_seats": 36,
        "available_seats": 36,
    },
    {
        "route_id": "R103",
        "departure_city": "Hyderabad",
        "destination_city": "Mirpur Khas",
        "departure_time": "11:00 AM",
        "ticket_price": 800,
        "total_seats": 32,
        "available_seats": 32,
    },
    {
        "route_id": "R104",
        "departure_city": "Karachi",
        "destination_city": "Lahore",
        "departure_time": "07:00 PM",
        "ticket_price": 5000,
        "total_seats": 45,
        "available_seats": 45,
    },
    {
        "route_id": "R105",
        "departure_city": "Sukkur",
        "destination_city": "Hyderabad",
        "departure_time": "02:00 PM",
        "ticket_price": 1500,
        "total_seats": 30,
        "available_seats": 30,
    },
]

bookings = []
issued_booking_ids = set()


def display_menu():
    print("\n" + "=" * 40)
    print("      SMART BUS RESERVATION SYSTEM      ")
    print("=" * 40)
    print("1. View Available Routes")
    print("2. Search for a Route")
    print("3. Book a Ticket")
    print("4. View My Bookings")
    print("5. Cancel a Booking")
    print("6. View Seat Availability")
    print("7. Generate Booking Report")
    print("8. Display Route Schedule")
    print("9. Exit")
    print("=" * 40)


def view_available_routes():
    print("\nAVAILABLE BUS ROUTES")
    print("No.  Route  Journey                  Depart     Fare       Seats")
    print("-" * 65)
    for idx, r in enumerate(routes, start=1):
        status_text = f"{r['available_seats']}/{r['total_seats']}"
        if r["available_seats"] == 0:
            status_text += " (Fully Booked)"
        journey = f"{r['departure_city']} -> {r['destination_city']}"
        print(f"{idx:<4} {r['route_id']:<6} {journey:<24} {r['departure_time']:<10} Rs.{r['ticket_price']:<8} {status_text}")


def search_routes():
    print("\nSEARCH FOR A ROUTE")
    query = input("Enter route ID or city name: ").strip().lower()

    if not query:
        print("Search query cannot be blank.")
        return

    matches = []
    for r in routes:
        if (
            query == r["route_id"].lower()
            or query in r["departure_city"].lower()
            or query in r["destination_city"].lower()
        ):
            matches.append(r)
            if query == r["route_id"].lower():
                break

    if not matches:
        print(f"No routes found matching '{query}'.")
        return

    print(f"\nFound {len(matches)} matching route(s):")
    for r in matches:
        status = "Available" if r["available_seats"] > 0 else "Fully Booked"
        journey = f"{r['departure_city']} -> {r['destination_city']}"
        print(f"- {r['route_id']} | {journey} | {r['departure_time']} | Rs. {r['ticket_price']} | {r['available_seats']}/{r['total_seats']} seats ({status})")


def book_ticket():
    print("\nBOOK A TICKET")

    name = input("Enter passenger name: ").strip()
    if not name:
        print("Error: Passenger name cannot be blank.")
        return

    age_input = input("Enter passenger age: ").strip()
    if not age_input.isdigit() or int(age_input) <= 0:
        print("Error: Age must be a positive whole number.")
        return
    age = int(age_input)

    route_id = input("Enter route ID (e.g. R101): ").strip().upper()
    target_route = None
    for r in routes:
        if r["route_id"] == route_id:
            target_route = r
            break

    if not target_route:
        print(f"Error: Route '{route_id}' does not exist.")
        return

    seats_input = input(f"Enter seats to book (Available: {target_route['available_seats']}): ").strip()
    if not seats_input.isdigit() or int(seats_input) <= 0:
        print("Error: Seats must be a positive whole number.")
        return
    seats_to_book = int(seats_input)

    if seats_to_book > target_route["available_seats"]:
        print(f"Error: Cannot book {seats_to_book} seat(s). Only {target_route['available_seats']} available on {route_id}.")
        return

    next_num = 1001 + len(bookings)
    booking_id = f"B{next_num}"
    while booking_id in issued_booking_ids:
        next_num += 1
        booking_id = f"B{next_num}"

    issued_booking_ids.add(booking_id)
    total_fare = target_route["ticket_price"] * seats_to_book
    target_route["available_seats"] -= seats_to_book

    new_booking = {
        "booking_id": booking_id,
        "passenger_name": name,
        "passenger_age": age,
        "route_id": target_route["route_id"],
        "seats": seats_to_book,
        "total_fare": total_fare,
        "status": "Confirmed",
    }
    bookings.append(new_booking)

    print("\nBooking confirmed successfully!")
    print(f"Booking ID:     {booking_id}")
    print(f"Passenger:      {name} ({age} yrs)")
    print(f"Journey:        {target_route['departure_city']} -> {target_route['destination_city']} ({target_route['route_id']})")
    print(f"Departure Time: {target_route['departure_time']}")
    print(f"Seats Booked:   {seats_to_book}")
    print(f"Fare per Seat:  Rs. {target_route['ticket_price']}")
    print(f"Total Fare:     Rs. {total_fare}")
    print("Status:         Confirmed")


def view_my_bookings():
    print("\nMY BOOKINGS HISTORY")
    if not bookings:
        print("No bookings found.")
        return

    print("No.  Booking ID  Passenger            Route   Seats  Total Fare   Status")
    print("-" * 72)
    for idx, b in enumerate(bookings, start=1):
        passenger = f"{b['passenger_name']} ({b['passenger_age']})"
        fare_text = f"Rs. {b['total_fare']}"
        print(f"{idx:<4} {b['booking_id']:<11} {passenger:<20} {b['route_id']:<7} {b['seats']:<6} {fare_text:<12} {b['status']}")


def cancel_booking():
    print("\nCANCEL A BOOKING")
    booking_id = input("Enter booking ID to cancel (e.g. B1001): ").strip().upper()

    for b in bookings:
        if b["booking_id"] == booking_id:
            if b["status"] == "Cancelled":
                print(f"Error: Booking '{booking_id}' is already cancelled. Seats cannot be restored twice.")
                return

            for r in routes:
                if r["route_id"] == b["route_id"]:
                    r["available_seats"] = min(r["total_seats"], r["available_seats"] + b["seats"])
                    b["status"] = "Cancelled"
                    print(f"\nBooking {booking_id} has been cancelled.")
                    print(f"Seats restored: {b['seats']}")
                    print(f"Route {r['route_id']} now has {r['available_seats']} available seat(s).")
                    return
            break
    else:
        print(f"Error: Booking ID '{booking_id}' not found.")


def view_seat_availability():
    print("\nSEAT AVAILABILITY & NETWORK CAPACITY")
    print("Route   Journey                  Available / Total    Category Status")
    print("-" * 70)

    for r in routes:
        if r["available_seats"] == 0:
            category = "Fully Booked"
        elif r["available_seats"] == r["total_seats"]:
            category = "Available"
        else:
            category = "Partially Booked"

        journey = f"{r['departure_city']} -> {r['destination_city']}"
        capacity = f"{r['available_seats']} / {r['total_seats']} seats"
        print(f"{r['route_id']:<7} {journey:<24} {capacity:<20} {category}")


def generate_booking_report():
    print("\n" + "=" * 45)
    print("             BOOKING REPORT             ")
    print("=" * 45)

    total_bookings = len(bookings)
    confirmed_bookings = sum(1 for b in bookings if b["status"] == "Confirmed")
    cancelled_bookings = sum(1 for b in bookings if b["status"] == "Cancelled")
    seats_reserved = sum(b["seats"] for b in bookings if b["status"] == "Confirmed")
    confirmed_revenue = sum(b["total_fare"] for b in bookings if b["status"] == "Confirmed")
    fully_booked_routes = sum(1 for r in routes if r["available_seats"] == 0)

    print(f"Total bookings created:  {total_bookings}")
    print(f"Confirmed bookings:      {confirmed_bookings}")
    print(f"Cancelled bookings:      {cancelled_bookings}")
    print(f"Seats currently reserved:{seats_reserved}")
    print(f"Confirmed revenue:       Rs. {confirmed_revenue:,}")
    print(f"Fully booked routes:     {fully_booked_routes}")

    print("\n--- Route Breakdown ---")
    for r in routes:
        route_confirmed = [b for b in bookings if b["route_id"] == r["route_id"] and b["status"] == "Confirmed"]
        seats_booked = sum(b["seats"] for b in route_confirmed)
        revenue = sum(b["total_fare"] for b in route_confirmed)
        status = "Fully Booked" if r["available_seats"] == 0 else f"{r['available_seats']} seats free"
        print(f"{r['route_id']} ({r['departure_city']} -> {r['destination_city']}): {len(route_confirmed)} booking(s), {seats_booked} seat(s), Rs. {revenue:,} ({status})")
    print("=" * 45)


def display_schedule():
    print("\nROUTE SCHEDULE BY DEPARTURE CITY")
    for city in SUPPORTED_CITIES:
        print(f"\n{city}")
        city_departures = [r for r in routes if r["departure_city"].lower() == city.lower()]
        if not city_departures:
            print("  No scheduled departures.")
        else:
            for r in city_departures:
                print(f"  {r['route_id']} -> {r['destination_city']} | {r['departure_time']} | Rs. {r['ticket_price']} ({r['available_seats']} seats free)")


def main():
    print("Welcome to Smart Bus Ticket Booking & Reservation System!")

    while True:
        display_menu()
        choice = input("Enter your choice (1-9): ").strip()

        if choice == "1":
            view_available_routes()
        elif choice == "2":
            search_routes()
        elif choice == "3":
            book_ticket()
        elif choice == "4":
            view_my_bookings()
        elif choice == "5":
            cancel_booking()
        elif choice == "6":
            view_seat_availability()
        elif choice == "7":
            generate_booking_report()
        elif choice == "8":
            display_schedule()
        elif choice == "9":
            print("\nThank you for using Smart Bus Reservation System. Goodbye!")
            break
        else:
            print("\nInvalid choice! Please select an option between 1 and 9.")


if __name__ == "__main__":
    main()
