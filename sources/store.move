module store::store {
    use sui::event;
    use std::string::String;
    use sui::transfer;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::object::{Self, UID};
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};

    // Constants
    const BASIC_UPDATE_AMOUNT: u64 = 1000;

    // Errors 
    const ERROR_INSUFFICIENT_FUNDS: u64 = 0;

    // Events
    public struct Event has copy, drop, store {
        ca: String,
        name: String,
        symbol: String,
        description: String,
        uri: String,
    } 

    public fun create<T>(
        treasury: TreasuryCap<T>,
        ca: String,
        name: String,
        symbol: String,
        description: String,
        uri: String,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let mut treasury_mut = treasury;
        coin::mint_and_transfer(&mut treasury_mut, AMOUNT, recipient, ctx);
        let _event = Event{
            ca: ca,
            name: name,
            symbol: symbol,
            description,
            uri: uri,
        };
        transfer::public_transfer<coin::TreasuryCap<T>>(treasury_mut, @0x0);
        event::emit<Event>(_event);
    }
} 