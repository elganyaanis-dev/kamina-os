//! Kamina Chain - High Performance Blockchain
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::traits::{Currency, ExistenceRequirement};
use sp_runtime::{
    generic, impl_opaque_keys,
    traits::{BlakeTwo256, IdentifyAccount, Verify},
    MultiSignature, OpaqueExtrinsic
};

pub type Signature = MultiSignature;
pub type AccountId = <<Signature as Verify>::Signer as IdentifyAccount>::AccountId;
pub type Balance = u128;
pub type BlockNumber = u32;
pub type Hash = sp_core::H256;
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
pub type Block = generic::Block<Header, OpaqueExtrinsic>;

// -- Pallet Kamina Token --
#[frame_support::pallet]
pub mod pallet {
    use super::*;
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
        type Currency: Currency<Self::AccountId>;
    }

    #[pallet::storage]
    pub type TotalSupply<T: Config> = StorageValue<_, Balance, ValueQuery>;

    #[pallet::storage]
    pub type Balances<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, Balance>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        Transfer(T::AccountId, T::AccountId, Balance),
        Minted(T::AccountId, Balance),
    }

    #[pallet::error]
    pub enum Error<T> {
        InsufficientBalance,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn transfer(
            origin: OriginFor<T>,
            dest: T::AccountId,
            value: Balance,
        ) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            
            <T as Config>::Currency::transfer(
                &sender,
                &dest,
                value,
                ExistenceRequirement::KeepAlive,
            )?;
            
            Self::deposit_event(Event::Transfer(sender, dest, value));
            Ok(())
        }
    }
}

pub trait IKaminaChain {
    fn get_balance(account: AccountId) -> Option<Balance>;
}
