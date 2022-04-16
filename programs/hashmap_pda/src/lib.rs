use anchor_lang::prelude::*;

declare_id!("CeZyKNGLKajGqBZ2Z2t1WcAzvygoBchp7Ke54VGVebt4");

#[program]
pub mod hashmap_pda {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {

        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.bump = *ctx.bumps.get("user_stats").unwrap();
        Ok(())
    }

    pub fn add_name(ctx: Context<ChangeName>, name: String) -> Result<()> {
        ctx.accounts.user_stats.name = name;
        ctx.accounts.user_stats.level = 0;

        Ok(())
    }

    pub fn change_name(ctx: Context<ChangeName>, name: String) -> Result<()> {

        
        ctx.accounts.user_stats.name = name;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> { 
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump
    )]
    pub user_stats: Account<'info, Game>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct ChangeName<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump = user_stats.bump)]
    pub user_stats: Account<'info, Game>
}

#[account]
pub struct Game {
    pub name: String, 
    pub level: u8,
    pub bump: u8
}
