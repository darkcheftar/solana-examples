use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey
};
use solana_program::sysvar::clock::Clock;
use solana_program::sysvar::Sysvar;

entrypoint!(process_instruction);

fn process_instruction(
    program_id:&Pubkey,
    accounts:&[AccountInfo],
    instruction_date:&[u8],
) -> ProgramResult{
    let rand = Clock::get().unwrap().unix_timestamp%10;
    msg!("The Random value is: {}", rand);
    Ok(())
}