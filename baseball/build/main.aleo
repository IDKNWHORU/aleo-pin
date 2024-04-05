program base_ball_game.aleo;

struct Game:
    target as [u8; 3u32];

record Score:
    owner as address.private;
    input_value as u8.private;


mapping life:
	key as address.public;
	value as u8.public;


mapping score:
	key as address.public;
	value as u8.public;

closure evaluate_guess:
    input r0 as Game;
    input r1 as [u8; 3u32];
    is.eq r1[0u32] r0.target[0u32] into r2;
    add 0u8 1u8 into r3;
    is.eq r1[0u32] r0.target[1u32] into r4;
    is.eq r1[0u32] r0.target[2u32] into r5;
    or r4 r5 into r6;
    add 0u8 1u8 into r7;
    ternary r6 r7 0u8 into r8;
    ternary r2 r3 0u8 into r9;
    ternary r2 0u8 r8 into r10;
    is.eq r1[1u32] r0.target[1u32] into r11;
    add r9 1u8 into r12;
    is.eq r1[1u32] r0.target[0u32] into r13;
    is.eq r1[1u32] r0.target[2u32] into r14;
    or r13 r14 into r15;
    add r10 1u8 into r16;
    ternary r15 r16 r10 into r17;
    ternary r11 r12 r9 into r18;
    ternary r11 r10 r17 into r19;
    is.eq r1[2u32] r0.target[2u32] into r20;
    add r18 1u8 into r21;
    is.eq r1[2u32] r0.target[0u32] into r22;
    is.eq r1[2u32] r0.target[1u32] into r23;
    or r22 r23 into r24;
    add r19 1u8 into r25;
    ternary r24 r25 r19 into r26;
    ternary r20 r21 r18 into r27;
    ternary r20 r19 r26 into r28;
    cast  r27 r28 into r29 as [u8; 2u32];
    output r29 as [u8; 2u32];


function init:
    input r0 as u8.private;
    input r1 as u8.private;
    input r2 as u8.private;
    assert.neq r0 r1;
    assert.neq r0 r2;
    assert.neq r1 r2;
    cast  r0 r1 r2 into r3 as [u8; 3u32];
    cast r3 into r4 as Game;
    async init self.caller into r5;
    output r4 as Game.private;
    output r5 as base_ball_game.aleo/init.future;

finalize init:
    input r0 as address.public;
    set 9u8 into life[r0];


function main:
    input r0 as Game.private;
    input r1 as u8.private;
    input r2 as u8.private;
    input r3 as u8.private;
    cast  r1 r2 r3 into r4 as [u8; 3u32];
    call evaluate_guess r0 r4 into r5;
    async main self.caller r5 into r6;
    output r5 as [u8; 2u32].private;
    output r6 as base_ball_game.aleo/main.future;

finalize main:
    input r0 as address.public;
    input r1 as [u8; 2u32].public;
    get life[r0] into r2;
    is.neq r1[0u32] 3u8 into r3;
    not r3 into r4;
    is.neq r2 0u8 into r5;
    or r4 r5 into r6;
    assert.eq r6 true;
    sub r2 1u8 into r7;
    set r7 into life[r0];


function recording:
    input r0 as u8.private;
    cast self.caller r0 into r1 as Score.record;
    async recording self.caller r0 into r2;
    output r1 as Score.record;
    output r2 as base_ball_game.aleo/recording.future;

finalize recording:
    input r0 as address.public;
    input r1 as u8.public;
    get.or_use score[r0] 0u8 into r2;
    add r2 r1 into r3;
    set r3 into score[r0];
