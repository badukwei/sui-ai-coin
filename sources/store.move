module store::store {
    use sui::event::emit;
    use sui::coin::{Self, TreasuryCap, Coin};
    use sui::balance::{Self, Balance};
    use sui::dynamic_object_field::{Self};
    use std::string::String;

    // Constants
    const TOTAL_AMOUNT: u64 = 1000000000;
    const BASIC_UPDATE_AMOUNT: u64 = 1000;
    const BASIC_CHAT_FEE_AMOUNT: u64 = 10;
    const BASIC_DONATE_AMOUNT: u64 = 100;
    const MIN_LENGTH: u64 = 1;

    // Errors 
    const ERROR_INSUFFICIENT_FUNDS: u64 = 0;
    fun err_not_enough_fund() { abort ERROR_INSUFFICIENT_FUNDS }
    const ERROR_INVALID_BOT_ID: u64 = 1;
    fun err_boy_id_too_short() { abort ERROR_INVALID_BOT_ID }
    const ERROR_INVALID_CA: u64 = 2;
    fun err_ca_too_short() { abort ERROR_INVALID_CA }
    const ERROR_INVALID_NAME: u64 = 3;
    fun err_name_too_short() { abort ERROR_INVALID_NAME }
    const ERROR_INVALID_SYMBOL: u64 = 4;
    fun err_symbol_too_short() { abort ERROR_INVALID_SYMBOL }

    // Events
    public struct CreateBotEvent has copy, drop, store {
        bot_id: String,
        name: String,
        symbol: String,
        description: String,
        url: String,
        ca: String,
        bot_json: String,
    } 

    public struct UpdateBotEvent has copy, drop, store {
        bot_id: String,
        name: String,
        symbol: String,
        ca: String,
        old_bot_json: String,
        new_bot_json: String,
    } 

    public struct InitConfigEvent has copy, drop {
        admin_cap_id: ID,
        config_id: ID,
    }

    public struct ChatEvent has copy, drop, store {
        sender: address,
        amount: u64,
    }


    public struct DonateEvent has copy, drop, store {
        donator: address,
        donate_amount: u64,
    }

    // structs
    public struct AdminCap has store, key {
        id: UID,
    }

    public struct Config has key, store {
        id: UID,
        deployment_fee: u64,
        update_reward: u64,
        chat_use_fee: u64,
    }

    public struct BotPool<phantom T> has key, store {
        id: UID,
        bot_id: String,
        name: String,
        symbol: String,
        ca: String,
        bot_json: String,
        token_reserve: Balance<T>
    }

    // functions
    fun init(ctx: &mut TxContext) {
        let admin = AdminCap {
            id: object::new(ctx),
        };
        let config = Config {
            id: object::new(ctx),
            deployment_fee: 100000000,
            update_reward: BASIC_UPDATE_AMOUNT,
            chat_use_fee: BASIC_CHAT_FEE_AMOUNT,
        };

        let _event = InitConfigEvent {
            admin_cap_id: object::id<AdminCap>(&admin),
            config_id: object::id<Config>(&config),
        };

        emit<InitConfigEvent>(_event);
        
        transfer::public_transfer(admin, tx_context::sender(ctx));
        transfer::public_share_object(config);
    }

    public fun create_bot<T>(
        config: &mut Config,
        treasury: TreasuryCap<T>,
        bot_id: String,
        name: String,
        symbol: String,
        description: String,
        url: String,
        ca: String,
        bot_json: String,
        ctx: &mut TxContext,
    ) {
        if (bot_id.length() < MIN_LENGTH) err_boy_id_too_short();
        if (ca.length() < MIN_LENGTH) err_ca_too_short();
        if (name.length() < MIN_LENGTH) err_name_too_short();
        if (symbol.length() < MIN_LENGTH) err_symbol_too_short();

        let id = object::new(ctx);
        let mut treasury_mut = treasury;
        let deposit = coin::mint(&mut treasury_mut, TOTAL_AMOUNT, ctx);

        let pool = BotPool {
            id: id,
            bot_id: bot_id,
            name: name,
            symbol: symbol,
            ca: ca,
            bot_json: bot_json,
            token_reserve: deposit.into_balance(),
        };

        let _event = CreateBotEvent{
            bot_id: bot_id,
            name: name,
            symbol: symbol,
            description: description,
            url: url,
            ca: ca,
            bot_json: bot_json,
        };

        emit<CreateBotEvent>(_event);
        transfer::public_transfer<coin::TreasuryCap<T>>(treasury_mut, @0x0);
        dynamic_object_field::add(&mut config.id, ca, pool);
    }

    public fun update_bot<T>(
        config: &mut Config,
        recipient: address,
        bot_id: String,
        name: String,
        symbol: String,
        ca: String,
        bot_json: String,
        ctx: &mut TxContext,
    ) {
        if (bot_id.length() < MIN_LENGTH) err_boy_id_too_short();
        if (ca.length() < MIN_LENGTH) err_ca_too_short();
        if (name.length() < MIN_LENGTH) err_name_too_short();
        if (symbol.length() < MIN_LENGTH) err_symbol_too_short();

        let pool = dynamic_object_field::borrow_mut<String, BotPool<T>>(&mut config.id, ca);

        pool.bot_json = bot_json;

        let update_reward = config.update_reward;  
        let _coin = coin::from_balance<T>(0x2::balance::split<T>(&mut pool.token_reserve, update_reward), ctx);

        let _event = UpdateBotEvent{
            bot_id: bot_id,
            name: name,
            symbol,
            ca: ca,
            old_bot_json: pool.bot_json,
            new_bot_json: bot_json
        };

        emit<UpdateBotEvent>(_event);
        transfer::public_transfer(
            _coin,
            recipient
        )
    }

    public fun chat_with_bot<T>(
        config: &mut Config,
        deposit: Coin<T>,
        sender: address,
        ca: String,
    ) {
        if (deposit.value() < BASIC_CHAT_FEE_AMOUNT) err_not_enough_fund();
        let pool = dynamic_object_field::borrow_mut<String, BotPool<T>>(&mut config.id, ca);
        let _event = ChatEvent {
            sender: sender,
            amount: deposit.value()
        };

        emit<ChatEvent>(_event);
        let balance_deposit = deposit.into_balance();
        balance::join<T>(&mut pool.token_reserve, balance_deposit);
    }

     public fun donate_to_bot<T>(
        config: &mut Config,
        deposit: Coin<T>,
        sender: address,
        ca: String,
    ) {
        if (deposit.value() < BASIC_DONATE_AMOUNT) err_not_enough_fund();
        let pool = dynamic_object_field::borrow_mut<String, BotPool<T>>(&mut config.id, ca);
        let _event = DonateEvent {
            donator: sender,
            donate_amount: deposit.value()
        };

        emit<DonateEvent>(_event);
        let balance_deposit = deposit.into_balance();
        balance::join<T>(&mut pool.token_reserve, balance_deposit);
    }
} 